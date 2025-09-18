import asyncHandler from "express-async-handler";
import Category from "../../../../DB/models/category.model.js";
import {
  deleteFile,
  uploadfile,
  delete_files,
} from "../../../../utils/cloudinary.js";
import mongoose from "mongoose";
import Product from "../../../../DB/models/product.model.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description)
    throw new Error(`all inputs required`, { cause: 400 });
  const created = await Category.create({ name, description });
  if (created)
    return res
      .status(201)
      .json({ Message: `category added seccussfully`, category: created });
});
export const getCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) throw new Error(`category not found`, { cause: 404 });
  return res.status(200).json({ category });
});

export const photoCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) throw new Error(`category not found`, { cause: 404 });
  const file = req.file;
  if (!file) throw new Error(`file required`, { cause: 400 });
  const { secure_url, public_id } = await uploadfile({
    file: file,
    path: `categories/${category._id}`,
  });
  if (category.Image?.public_id) {
    await deleteFile(category.Image.public_id);
  }
  category.Image.public_id = public_id;
  category.Image.url = secure_url;
  await category.save();
  res.status(200).json({ Message: `photo uploaded` });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const updated = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  if (updated) {
    return res
      .status(200)
      .json({ Message: `category updated seccussfully`, category: updated });
  }
  throw new Error(`category not found`, { cause: 404 });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const session = await mongoose.startSession();
  req.session = session;
  session.startTransaction();
  const deleted = await Category.findByIdAndDelete(id,{} ,{ session });
  if (!deleted) {
    throw new Error(`category not found`, { cause: 404 });
  }
  if (deleted.Image?.public_id) {
    await delete_files({ path: `categories/${id}` });
  }
  await Product.deleteMany({ categoryId: id }, {}, { session });
  await session.commitTransaction();
  session.endSession();
  return res
    .status(200)
    .json({ Message: `category deleted seccussfully`, category: deleted });
});

export const allCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const offset = (page - 1) * limit;
  const categories = await Category.find({})
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
  const total = await Category.countDocuments();
  return res.status(200).json({
    list: categories,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});
