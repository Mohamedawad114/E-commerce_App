import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import "dotenv/config";
import {
  uploadfile,
  deleteFile,
  delete_files,
  connection,
  decryption,
  encryption,
} from "../../../../utils/index.js";
import User from "../../../../DB/models/user.model.js";
import Notification from "../../../../DB/models/notification.model.js";
import Wishlist from "../../../../DB/models/wishlist.model.js";
import Cart from "../../../../DB/models/cart.model.js";
import { emailQueue } from "../../../../Queues/index.js";

export const profile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const userProfile = await User.findById(id, {
    __v: 0,
    role: 0,
    password: 0,
  });
  if (!userProfile) throw new Error(`user not found`, { cause: 404 });
  if (userProfile.phone) {
    userProfile.phone = decryption(userProfile.phone);
  }
  return res.status(200).json({ profile: userProfile });
});

export const Notifications = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);
  const notifications = await Notification.find(
    { userId: id, isRead: false },
    { isRead: 0, userId: 0 }
  ).sort({ createdAt: -1 });
  await Notification.updateMany(
    { userId: id, isRead: false },
    { $set: { isRead: true } }
  );
  return res.status(200).json({ notifications });
});

export const updateuser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { Name, email, phone, address, age } = req.body;
  if (email) {
    const valid_email = await User.findOne({ email: email });
    if (valid_email) throw new Error(`email already existed`, { cause: 409 });
  }
  if (phone) {
    phone = encryption(phone);
  }
  const updatedUser = await User.findByIdAndUpdate(id, {
    Name,
    address,
    age,
    email,
    phone: phone,
  });
  if (!updatedUser) throw new Error(`something wrong`, { cause: 400 });
  return res.status(200).json({ message: `profile updated` });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;
  if (!oldPassword || !newPassword || !newPasswordConfirm)
    throw new Error(`all input required`, { cause: 400 });
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error(`invalid oldPasword`, { cause: 400 });
  user.password = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
  await user.save();
  const keys = await connection.keys(`refreshToken:${user._id}:*`);
  if (keys.length) await connection.del(...keys);
  return res.status(200).json({ message: `password updated` });
});

export const resetPasswordreq = asyncHandler(async (req, res) => {
  const user = req.user;
  await emailQueue.add("sendEmail", {
    type: "resetPassword",
    email: user.email,
  });
  return res.status(200).json({ message: `OTP is sent` });
});

export const resetPasswordconfrim = asyncHandler(async (req, res) => {
  const user = req.user;
  const { OTP, newPassword } = req.body;
  if (!OTP || !newPassword)
    throw new Error(`Both OTP and new passwords are required`, { cause: 400 });
  const savedOTP = await connection.get(`otp_reset:${user.email}`);
  if (!savedOTP) throw new Error(`expire OTP.`, { cause: 400 });
  const isMatch = await bcrypt.compare(OTP, savedOTP);
  if (!isMatch) throw new Error(`Invalid OTP`, { cause: 400 });
  const hashpassword = await bcrypt.hash(
    newPassword,
    parseInt(process.env.SALT)
  );
  user.password = hashpassword;
  await connection.del(`otp_reset:${user.email}`);
  await user.save();
  const keys = await connection.keys(`refreshToken:${user._id}:*`);
  if (keys.length) await connection.del(...keys);
  return res.status(200).json({ message: `password updated` });
});

export const resendOTP_reset = asyncHandler(async (req, res) => {
  const user = req.user;
  await emailQueue.add("sendEmail", {
    type: "resetPassword",
    email: user.email,
  });
  return res.status(200).send(`OTP sent`);
});
export const uploadphoto = asyncHandler(async (req, res) => {
  const user = req.user;
  const file = req.file;
  if (!file) throw new Error(`file reguired`, { cause: 400 });
  const { secure_url, public_id } = await uploadfile({
    file,
    path: `users/_${user._id}`,
  });
  if (user.profileImg?.public_id) await deleteFile(user.profileImg.public_id);
  user.profileImg.url = secure_url;
  user.profileImg.public_id = public_id;
  await user.save();
  return res.status(200).json({ message: `photo uploaded` });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (!err && decoded.jti) {
      await connection.del(`refreshToken:${decoded.id}:${decoded.jti}`);
    }
    res.clearCookie("refreshToken").sendStatus(204);
  });
});
export const logoutAllDevices = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (!err && decoded.jti) {
      const keys = await connection.keys(`refreshToken:${decoded.id}:*`);
      if (keys.length) await connection.del(keys);
    }
    res.clearCookie("refreshToken").sendStatus(204);
  });
});
export const deleteAccount = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  const id = req.user.id;
  req.session = session;
  session.startTransaction();
  const deleted = await User.findByIdAndDelete(id).session(session);
  await Notification.deleteMany({ userId: id }).session(session);
  await Wishlist.deleteMany({ userId: id }).session(session),
    await Cart.deleteOne({ userId: id }).session(session);
  await session.commitTransaction();
  session.endSession();
  if (!deleted) throw new Error(`user not found`, { cause: 404 });
  if (deleted.profileImg?.public_id)
    await delete_files({ path: `users/_${id}` });
  const keys = await connection.keys(`refreshToken:${id}:*`);
  if (keys.length) await connection.del(...keys);
  res.clearCookie("refreshToken").json({ message: `account deleted` });
});
