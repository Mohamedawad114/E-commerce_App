import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../../../../DB/models/user.model.js";
import {
  connection,
  delete_files,
  decryption,
} from "../../../../utils/index.js";
import { emailQueue } from "../../../../Queues/index.js";

export const gertusers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  let users = await User.find(
    { role: "user", isbanned: false },
    { password: 0 }
  )
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await User.countDocuments({ role: "user", isbanned: false });

  users = users.map((user) => {
    return {
      ...user._doc,
      phone: user.phone ? decryption(user.phone) : null,
    };
  });
  if (users.length == 0) {
    return res.status(200).json({ message: "no Users yet" });
  }
  return res.status(200).json({
    users,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});

export const BannesUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  let users = await User.find({ role: "user", isbanned: true }, { password: 0 })
    .skip(offset)
    .limit(limit)
    .sort({ updatedAt: -1 })
    .lean();
  const total = await User.countDocuments({ isbanned: true });
  users = users.map((user) => {
    return {
      ...user,
      phone: user.phone ? decryption(user.phone) : null,
    };
  });
  if (users.length == 0) {
    return res.status(200).json({ message: "no Users yet" });
  }
  return res.status(200).json({
    users,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});
export const gertuser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const name = req.query.name;
  if (id) {
    const Usersearch = await User.findById(id, {
      password: 0,
      updatedAt: 0,
      __v: 0,
      role: 0,
    });
    Usersearch.phone = decryption(Usersearch.phone);
    return res.status(200).json({ Usersearch });
  }
  let searchResults = await User.find(
    {
      Name: { $regex: name, $options: "i" },
    },
    {
      password: 0,
      updatedAt: 0,
      __v: 0,
      role: 0,
    }
  ).lean();
  if (searchResults.length) {
    searchResults = searchResults.map((user) => {
      return {
        ...user,
        phone: user.phone ? decryption(user.phone) : null,
      };
    });
    return res.status(200).json({ searchResults });
  }
  throw new Error(`User not found`, { cause: 404 });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    const id = req.params.id;
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
    res.clearCookie("refreshToken").json({ message: `user deleted` });
});

export const BannUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({_id: id,isbanned:true });
  if (!user) throw new Error(`user not found`, { cause: 404 });
  await connection.set(`bannedUser:${user.email}`, "true");
  const keys = await connection.keys(`refreshToken:${id}:*`);
  if (keys.length) {
    await connection.del(...keys);
  }
  user.isbanned = true;
  await user.save();
  await emailQueue.add("sendEmail", { type: "ban", email: user.email });
  res.clearCookie("refreshToken").json({ message: `user Banned` });
});
export const UnBannUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) throw new Error(`user not found`, { cause: 404 });
  if (user.isbanned === false) {
    return res.status(200).json({ message: "User is already unbanned" });
  }
  await connection.del(`bannedUser:${user.email}`);
  user.isbanned = false;
  await user.save();
  res.status(200).json({
    message: "User unbanned successfully",
    email: user.email,
    isbanned: user.isbanned,
  });
});
