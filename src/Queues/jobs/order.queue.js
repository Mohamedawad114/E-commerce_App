import { Queue } from "bullmq";
import { connection } from "../../utils/index.js";

export const orderQueue = new Queue("orderQueue", { connection });

export const expireOrderQueue = async (orderId) => {
  await orderQueue.add(
    "expiryOrder",
    {
      orderId,
      userId
    },
    {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
      delay: 4 * 24 * 60 * 60 * 1000 ,
    }
  );
};
