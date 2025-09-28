import asyncHandler from "express-async-handler";
import Category from "../../../../DB/models/category.model.js";

export const allCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const categories = await Category.find({}, { createdAt: 0, updatedAt: 0 })
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
  const total = await Category.countDocuments();
  return res.status(200).json({
    categories,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});

export const search = asyncHandler(async (req, res) => {
  const name = req.query.name;
  if (!name) throw new Error(`name is required`, { cause: 400 });
  const categories = await Category.find({
    name: { $regex: name, $options: "i" },
  }).lean();
  if (!categories.length)
    return res.status(200).json({ message: `no categories found` });
  
  return res.status(200).json({ categories: categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) throw new Error(`category not found`, { cause: 404 });
  return res.status(200).json({ category });
});
