import Order from "../../../DB/models/order.model.js";
import User from "../../../DB/models/user.model.js";
import { emailQueue } from "../../../Queues/index.js";
import { stripe } from "../../../utils/index.js";
import env from "dotenv";
env.config({ path: "./dev.env" });



export const createpayment = async (req, res) => {
  const {orderId} = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new Error("order not found");
  const amount = Math.round(order.total_price * 100);
  const paymentIntent =await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    metadata: { order: order._id.toString() },
    automatic_payment_methods: { enabled: true },
  });
  return res.json({ client_secret: paymentIntent.client_secret });
};

export const webhooks = async (Request, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const order = await Order.findById(paymentIntent.metadata.order);
    const user=await User.findById(order.userId)
    order.status = "confirmed";
    order.paymentId=paymentIntent.id
    await order.save();
    await emailQueue.add("sendEmail", {
      type: "confirmOrder",
      email: user.email,
    });
    await notificationQueue.add("createNotification", {
      userId: user._id,
      title: "🛒 تم الدفع بنجاح",
      content: `شكرًا لإتمام الدفع! طلبك الآن قيد المعالجة وسيتم إشعارك عند الشحن`,
    });
  }
};
