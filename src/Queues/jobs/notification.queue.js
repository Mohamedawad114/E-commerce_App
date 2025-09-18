import { Queue } from "bullmq";
import { connection } from "../../utils/index.js";

export const notificationQueue = new Queue("notificationQueue", { connection });

export const NotQueue = async (userId,title,content) => {
  await notificationQueue.add(
    "createNotification",
    {
      userId,
      title,
      content,
    },
    {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};
