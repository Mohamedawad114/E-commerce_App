import { Queue } from "bullmq";
import { connection } from "../../utils/index.js";

export const emailQueue = new Queue("EmailQueue", { connection });

export const sendEmailQueue = async (email,type) => {
  await emailQueue.add(
    "sendEmail",
    {
      type,
      to: email,
    },
    {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};
