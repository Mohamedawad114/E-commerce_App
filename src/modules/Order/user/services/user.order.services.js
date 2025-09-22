import { decryption } from "../../../../utils/index.js";
import { notificationQueue, orderQueue } from "../../../../Queues/index.js";
import Product from "../../../../DB/models/product.model.js";
import Order from "../../../../DB/models/order.model.js";
import Cart from "../../../../DB/models/cart.model.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const user = req.user;
  if (!user.password||!user.phone||!user.address) {
    throw new Error("please complete your profile", { cause: 400 });
  }
  const userCart = await Cart.findOne({ userId: user._id });
  if (!userCart || userCart.products.length === 0) {
    throw new Error("please select product", { cause: 400 });
  }
  const userPhone = decryption(user.phone);
  const {
    phone = `${userPhone}`,
    address = `${user.address}`,
    payment_method,
  } = req.body;
  if (!payment_method) {
    throw new Error("please choose payment method", { cause: 400 });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  const createdOrder = await Order.create([
    {
      phone,
      address,
      userId: user._id,
      total_price: userCart.total_price,
      products: userCart.products,
      payment_method,
    }],
    { session }
  );
  await Promise.all(
    userCart.products.map(async (P) => {
      const product = await Product.findById(P.productId).session(session);
      if (!product) throw new Error("Product not found", { cause: 404 });
      if (product.stock < P.quantity) {
        throw new Error("Not enough stock", { cause: 400 });
      }
      product.stock -= P.quantity;
      await product.save({ session });
    })
  );
  userCart.products = [];
  userCart.total_price = 0;
  await userCart.save({ session });
  await session.commitTransaction();
  session.endSession();
  await orderQueue.add("expiryOrder", {
    orderId: createdOrder._id,
    userId: user._id,
  });
  await notificationQueue.add("createNotification", {
    userId: user._id,
    title: "🛒 Order Placed Successfully",
    content: ` Your order ${createdOrder._id} has been placed. We’ll notify you once it’s confirmed,`,
  });
  return res.status(201).json({
    message: "order created successfully",
    orderId: createdOrder._id,
  });
};

export const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({ _id: orderId, userId: req.user.id });
  if (!order) throw new Error(`order not found`, { cause: 404 });
  if (order.status == "pending") {
    const session = await mongoose.startSession();
    session.startTransaction();
    order.status = "canceled";
    await order.save({ session });
    await Promise.all(
      order.products.map(async (p) => {
        const product = await Product.findById(p.productId).session(session);
        if (product) {
          product.stock += p.quantity;
          await product.save({ session });
        }
      })
    );
    await session.commitTransaction();
    await notificationQueue.add("createNotification", {
      userId: req.user.id,
      title: "❌ Order Canceled",
      content: ` our order ${orderId} has been canceled. If this wasn’t intended, you can reorder anytime`,
    });
    return res.status(200).json({ message: `order canceled` });
  }
  if (order.status == "canceled")
    throw new Error(`order already canceled`, { cause: 400 });
  throw new Error(`can't cancel order ,it is already confirmed`, {
    cause: 400,
  });
};

export const getOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({
    _id: orderId,
    userId: req.user.id,
  }).lean();
  if (!order) throw new Error(`order not found`, { cause: 404 });
  return res.status(200).json({ order });
};
export const getOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  if (!orders) return res.status(200).json({ message: `No orders  yet` });
  return res.status(200).json({ orders });
};
