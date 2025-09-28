import { Worker } from "bullmq";
import { connection } from "../../utils/index.js";
import Order from "../../DB/models/order.model.js";
import Product from "../../DB/models/product.model.js";
import mongoose from "mongoose";

const orderWorker = new Worker(
  "orderQueue",
  async (job) => {
    if (job.name === "expiryOrder") {
      const { orderId, userId } = job.data;
      const session = await mongoose.startSession();
      session.startTransaction();
      const order = await Order.findById(orderId);
      if (!order || order.status !== "pending") return;
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
      await notificationQueue.add("createNotification", {
        userId: userId,
        title: "❌ Order Canceled",
        content: `your order ${orderId} has been canceled. If this wasn’t intended, you can reorder anytime`,
      });
    }
  },
  { connection }
);

orderWorker.on("completed", (job) => {
  console.log(`✅ Job done: ${job.id}`);
});

orderWorker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.id}`, err);
});
