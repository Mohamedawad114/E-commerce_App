import asyncHandler from "express-async-handler";
import Product from "../../../../DB/models/product.model.js";
import Category from "../../../../DB/models/category.model.js";
import { connection } from "../../../../utils/index.js";

export const topSelling_products = asyncHandler(async (req, res) => {
  const topSelling = await connection.get("top:global:selling");
  if (topSelling) {
    return res
      .status(200)
      .json({ products: JSON.parse(topSelling), source: "cache" });
  }
  const products = await Product.find({}).sort({ sold: -1 }).limit(20).lean();
  return res.status(200).json({ products, source: "DB" });
});
export const topRating_products = asyncHandler(async (req, res) => {
  const topRating = await connection.get("top:global:rating");
  if (topRating) {
    return res
      .status(200)
      .json({ products: JSON.parse(topRating), source: "cache" });
  } else {
    const products = await Product.find({})
      .sort({ avgRating: -1 })
      .limit(20)
      .lean();
    return res.status(200).json({ products });
  }
});

export const categotyProducts_sorted = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const category = await Category.findById(categoryId);
  if (!category) throw new Error(`category not found`, { cause: 400 });
  let sort = {};
  if (req.query.sort === "priceAsc") sort.price = 1;
  else if (req.query.sort === "priceDesc") sort.price = -1;
  else if (req.query.sort === "rating") sort.avgRating = -1;
  else sort.createdAt = -1;

  const products = await Product.find(
    { categoryId: categoryId },
    { createdAt: 0 },
    { sort }
  )
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
  const products = await Product.find(
    {
      name: { $regex: name, $options: "i" },
    },
    { createdAt: 0 }
  ).lean();
  return res.status(200).json({ products: products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id, { createdAt: 0 });
  if (product) {
    return res.status(200).json({ product: product });
  } else throw new Error(`product not found`, { cause: 404 });
});
export const getProductSummary = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id, {
    avgRating: 1,
    name: 1,
    Images: { $slice: 1 },
    price: 1,
  }).lean();
  if (product) {
    return res.status(200).json({ product });
  } else throw new Error(`product not found`, { cause: 404 });
});

export const topRating_products_forCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);
  if (!category) throw new Error(`category not found`, { cause: 404 });
  const topRating_products = await connection.get(
    `top:category:${categoryId}:rating`
  );
  if (topRating_products) {
    return res
      .status(200)
      .json({ products: JSON.parse(topRating_products), source: "cache" });
  }
  const products = await Product.find({ category: categoryId })
    .sort({ avgRating: -1 })
    .limit(20)
    .lean();
  await connection.set(
    `top:category:${categoryId}:rating`,
    JSON.stringify(products),
    "EX",
    60 * 60 * 24
  );

  return res.status(200).json({ products, source: "db" });
});
export const topselling_products_forCategory = asyncHandler(
  async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) throw new Error(`category not found`, { cause: 404 });
    const topselling_products = await connection.get(
      `top:category:${categoryId}:selling`
    );
    if (topselling_products) {
      return res
        .status(200)
        .json({ products: JSON.parse(topselling_products), source: "cache" });
    }
    const products = await Product.find({ categoryId: categoryId })
      .sort({ sold: -1 })
      .limit(20)
      .lean();
    await connection.set(
      `top:category:${categoryId}:selling`,
      JSON.stringify(products),
      "EX",
      60 * 60 * 24
    );
    return res.status(200).json({ products, source: "db" });
  }
);
