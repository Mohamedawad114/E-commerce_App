import asyncHandler from "express-async-handler";
import Wishlist from "../../../DB/models/wishlist.model.js";
import Product from "../../../DB/models/product.model.js";

export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const  productId  = req.params.id;
  const product = await Product.findById(productId);
  if (!product) throw new Error("product not found", { cause: 404 });
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [productId] });
  } else {
    const isExist = wishlist.products.find((p) => p.toString() === productId);
    if (isExist) throw new Error("product already in your wishlist");
    wishlist.products.push(productId);
    await wishlist.save();
  }
  return res
    .status(200)
    .json({ message: "Product added to wishlist", wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const  productId = req.params.id;
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) throw new Error("wishlist not found", { cause: 404 });
  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId
  );
  await wishlist.save();
  return res
    .status(200)
    .json({ message: "Product removed from wishlist", wishlist });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const wishlist = await Wishlist.findOne({ userId })
    .populate("products", "name price description avgRating")
    .lean();
  if (!wishlist || !wishlist.products.length) {
    return res.status(200).json({ wishlist: { products: [] } });
  }
  return res.status(200).json({ wishlist });
});
