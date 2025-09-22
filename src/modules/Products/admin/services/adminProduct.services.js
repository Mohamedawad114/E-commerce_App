import asyncHandler from "express-async-handler";
import Category from "../../../../DB/models/category.model.js";
import Product from "../../../../DB/models/product.model.js";
import {
  deleteFile,
  delete_files,
  uploadfiles,
} from "../../../../utils/cloudinary.js";
import mongoose from "mongoose";
import Cart from "../../../../DB/models/cart.model.js";
import Wishlist from "../../../../DB/models/wishlist.model.js";

export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, stock, price, categoryId } = req.body;
  if (!name || !description || !stock || !price || !categoryId)
    throw new Error(`all input required`, { cause: 400 });
  const category = await Category.findById(categoryId);
  if (!category) throw new Error(`category not found`, { cause: 404 });
  const created = await Product.create({
    name,
    description,
    stock,
    price,
    categoryId,
  });
  if (created) {
    category.product_num += 1;
    await category.save();
    return res
      .status(201)
      .json({ message: `product added successfully`, created });
  }
});

export const uploadPhotos = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const files = req.files;
  if (!files || files.length !== 4) {
    throw new Error("You must upload exactly 4 images", { cause: 400 });
  }
  const product = await Product.findById(id);
  if (!product) throw new Error(`product not found`, { cause: 404 });
  const attachment = await uploadfiles({
    files: files,
    path: `products/${id}`,
  });
  if (product.Images.length) {
    await Promise.all(
      product.Images.map((img) => {
        if (img.public_id) {
          return deleteFile(img.public_id);
        }
      })
    );
  }
  product.Images = attachment;
  await product.save();
  return res.status(200).json({ message: `images uploaded` });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) throw new Error(`product not found`, { cause: 404 });
  const { name, description, stock, price, categoryId } = req.body;
  if (!categoryId) {
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        stock,
        price,
      },
      { new: true }
    );
    if(updated)
    return res.status(200).json({ message: `product updated`, updated });
  }
  const category = await Category.findById(categoryId);
  if (!category) throw new Error(`category not found`, { cause: 404 });
  const old_Category = await Category.findById(product.categoryId);
  if (old_Category) {
    old_Category.product_num -= 1;
    await old_Category.save();
  }
  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      stock,
      price,
      categoryId,
    },
    { new: true }
  );
  category.product_num += 1;
  await category.save();
  return res.status(200).json({ message: `product updated`, updated });
});

export const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    return res.status(200).json({ product: product });
  } else throw new Error(`product not found`, { cause: 404 });
});
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  const deleted = await Product.findByIdAndDelete(id, {}, { session });
  await Cart.updateMany(
    {},
    { $pull: { products: { productId: id } } },
    { session }
  );
  await Wishlist.updateMany({}, { $pull: { products: id } }, { session });
  const category = await Category.findById(deleted.categoryId).session(session);
  if (category) {
    category.product_num -= 1;
    await category.save({ session });
    await session.commitTransaction();
    await session.endSession();
  }
  await delete_files({ path: `products/${id}` });
  return res.status(200).json({ message: `product deleted`, deleted });
});
export const categotyProducts = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const category = await Category.findById(categoryId);
  if (!category) throw new Error(`category not found`, { cause: 400 });
  const products = await Product.find({ categoryId: categoryId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .lean();
  const total = await Product.countDocuments({ categoryId: categoryId });
  return res.status(200).json({
    products,
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
  const products = await Product.find({
    name: { $regex: name, $options: "i" },
  }).lean();
  return res.status(200).json({ products: products });
});
