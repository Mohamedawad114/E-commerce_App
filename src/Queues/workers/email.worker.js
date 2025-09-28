import { Worker } from "bullmq";
import {
  bannedUser_email,
  connection,
  createAndSendOTP,
  createAndSendOTP_password,
  orderPaid_email,
} from "../../utils/index.js";

const handlers = {
  confirmation: async (data) => {
    await createAndSendOTP(data.email);
  },

  resetPassword: async (data) => {
    await createAndSendOTP_password(data.email);
  },

  ban: async (data) => {
    await bannedUser_email(data.email);
  },
  confirmOrder: async (data) => {
    await orderPaid_email(date.email);
  },
};

const emailWorker = new Worker(
  "EmailQueue",
  async (job) => {
    const { type, ...data } = job.data;
    const handler = handlers[type];
    if (handler) {
      await handler(data);
    } else {
      console.warn(`No handler for job: ${job.name}`);
    }
  },
  { connection }
);

emailWorker.on("completed", (job) =>
  console.log("✅ Completed", job.date, job.id)
);
emailWorker.on("failed", (job, err) =>
  console.error("❌ Failed", job?.data, job?.id, err)
);
