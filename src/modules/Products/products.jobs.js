import cron from "node-cron";

import Product from "../../DB/models/product.model.js";
import Category from "../../DB/models/category.model.js";
import { connection } from "../../utils/index.js";

cron.schedule(`0 * * * *`, async function TopProducts() {
  //global
  const soldproducts = await Product.find({})
    .sort({ sold: -1 })
    .limit(20)
    .lean();
  await connection.set(
    "top:global:selling",
    JSON.stringify(soldproducts),
    "EX",
    60 * 60
  );
  const ratingproducts = await Product.find({})
    .sort({ avgRating: -1 })
    .limit(20)
    .lean();
  await connection.set(
    "top:global:rating",
    JSON.stringify(ratingproducts),
    "EX",
    60 * 60
  );
});
cron.schedule(`0 1 * * *`, async function TopProducts() {
  //category
  const categories = await Category.find({}).lean();
  for (const category of categories) {
    const soldproducts = await Product.find({ categoryId: category._id })
      .sort({ sold: -1 })
      .limit(20)
      .lean();
    await connection.set(
      `top:category:${category._id}:selling`,
      JSON.stringify(soldproducts),
      "EX",
      60 * 60 * 24
    );
    const ratingproducts = await Product.find({ categoryId: category._id })
      .sort({ avgRating: -1 })
      .limit(20)
      .lean();
    await connection.set(
      `top:category:${category._id}:rating`,
      JSON.stringify(ratingproducts),
      "EX",
      60 * 60 * 24
    );
  }
});
