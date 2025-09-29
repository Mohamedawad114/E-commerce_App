import asyncHandler from "express-async-handler";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import {
  generateAccessToken,
  generateTokens,
  connection,
  encryption,
} from "../../../../utils/index.js";
import User from "../../../../DB/models/user.model.js";
import { emailQueue, notificationQueue } from "../../../../Queues/index.js";
env.config({ path: "./.dev.env" });


export const signup = asyncHandler(async (req, res) => {
  const { Name, user_name, password, email, role, age, phone, address } =
    req.body;
  const valid_email = await User.findOne({ email });
  if (valid_email) throw new Error(`email already existed `, { cause: 409 });
  const create = await User.create({
    Name,
    user_name,
    password: await bcrypt.hash(password, parseInt(process.env.SALT)),
    email,
    role,
    address,
    age,
    phone: encryption(phone),
  });
  if (create) {
    await emailQueue.add("sendEmail", { type: "confirmation", email: email });
    await notificationQueue.add("createNotification", {
      userId: create._id,
      title: "🎉 Welcome to E-commerce",
      content: `Hi ${user_name}, your account has been created successfully. We're excited to have you with us`,
    });
  }
  return res.status(201).json({ message: `signup done,OTP send` });
});
export const confrim_email = asyncHandler(async (req, res) => {
  const { OTP, email } = req.body;
  const user = await User.findOne({ email: email, isconfirmed: false });
  if (!user)
    throw new Error(`email is already confirmed or not found`, { cause: 400 });
  if (!OTP) throw new Error(`OTP required`, { cause: 400 });
  const savedOTP = await connection.get(`otp_${email}`);
  if (!savedOTP) {
    throw new Error(`expire OTP`, { cause: 400 });
  }
  const isMAtch = await bcrypt.compare(OTP, savedOTP);
  if (!isMAtch) throw new Error(`invalid OTP`, { cause: 400 });
  user.isconfirmed = true;
  await connection.del(`otp_${email}`);
  await user.save();
  return res.status(200).json({ message: `email is confirmed ` });
});
export const resendOTP = asyncHandler(async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email: email, isconfirmed: false });
  if (!user) throw new Error(`email not found or confimed`, { cause: 400 });
  await emailQueue.add("sendEmail", { type: "confirmation", email: email });
  return res.status(200).send(`OTP sent`);
});

async function verifyloginGoogle(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.CLIENTID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const signWithGoogle = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const payload = await verifyloginGoogle(idToken);
  const { name, given_name, family_name, email, email_verified, sub } = payload;
  if (!email_verified) throw new Error(`email not verified`, { cause: 400 });
  const user = await User.findOne({ email, subId: sub });
  if (user) {
    const accessToken = await generateTokens({
      res,
      id: user._id,
      role: user.role,
    });
    return res.status(200).json({ message: "Login successfully", accessToken });
  }
  const createdUser = await User.create({
    user_name: `${given_name}_${family_name}`,
    Name: name,
    password: null,
    email: email,
    age: null,
    phone: null,
    isconfirmed: true,
    provider: "google",
    subId: sub,
  });
  const accessToken = await generateTokens({
    res,
    id: user._id,
    role: user.role,
  });
  return res.status(201).json({ accessToken });
});

export const loginuser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) throw new Error(`email not found`, { cause: 404 });
  if (!user.isconfirmed)
    throw new Error(`email not verified please verify email first`, {
      cause: 400,
    });
  const isbanned = await connection.get(`bannedUser:${user.email}`);
  if (isbanned == "true" || user.isbanned == true) {
    throw new Error(`Your account has been suspended, please contact support.`);
  }
  const passMatch = await bcrypt.compare(password, user.password);
  if (!passMatch) throw new Error(`invalid Password or email`, { cause: 400 });
  const accessToken = await generateTokens({
    res,
    id: user._id,
    role: user.role,
  });
  await notificationQueue.add("createNotification", {
    userId: user._id,
    title: "👋 Login Successful",
    content: `Hi ${user.user_name}, you’ve just logged in to your account. If this wasn’t you, please reset your password immediately.`,
  });
  res.status(200).json({
    message: `login seccussfully`,
    accessToken,
  });
});
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    const isexisted = await connection.get(
      `refreshToken:${decoded.id}:${decoded.jti}`
    );
  
    if (!isexisted) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });
    return res.json({ accessToken });
  });
});
