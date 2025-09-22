import asyncHandler from "express-async-handler";
import Product from "../../../DB/models/product.model.js";
import Cart from "../../../DB/models/cart.model.js";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new Error(`product not found`, { cause: 404 });
  if (product.stock < quantity) {
    throw new Error("Not enough stock available", { cause: 400 });
  }
  const price = product.price;
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) {
    const created = await Cart.create({
      userId,
      products: [{ productId, quantity, price }],
    });
    return res.status(201).json({ message: `added to cart`, created });
  } else {
    const isExisted = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (isExisted) {
      isExisted.quantity += quantity;
      isExisted.price = price;
    } else {
      cart.products.push({ productId, quantity, price });
    }
  }
  await cart.save();
  return res.status(200).json({ message: `added to cart` });
});

export const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new Error(`product not found`, { cause: 404 });
  if (product.stock < quantity) {
    throw new Error("Not enough stock available", { cause: 400 });
  }
  const price = product.price;
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) {
    throw new Error("cart not found", { cause: 404 });
  } else {
    const isExisted = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (isExisted) {
      isExisted.quantity = quantity;
      isExisted.price = price;
    } else {
      cart.products.push({ productId, quantity, price });
    }
  }
  await cart.save();
  return res.status(200).json({ message: `cart updated` });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new Error(`product not found`, { cause: 404 });
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) {
    throw new Error("cart not found", { cause: 404 });
  } else {
    const index = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (index == -1) throw new Error("product not found");
    cart.products.splice(index, 1);
    await cart.save();
    return res.status(200).json({ message: `product remove from cart` });
  }
});
export const removeAllFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId: userId });
  if (cart) {
    (cart.products = []), (cart.total_price = 0);
    return res.status(200).json({ message: `cart removed` });
  }
});
export const userCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId: userId })
    .populate({
      path: "products.productId",
      select: "name description price avgRating",
    })
    .lean();
  if (cart) return res.status(200).json({ cart });
  return res.status(200).json({ messsage: `no products in your cart` });
});
export const summaryCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) throw new Error("no cart found", { cause: 404 });
  const products_number = cart.products.length;
  return res
    .status(200)
    .json({ total_price: cart.total_price, products: products_number });
});
