import { Worker } from "bullmq";
import { connection } from "../../utils/index.js";
import Notification from "../../DB/models/notification.model.js";

const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
    const { userId, content, title } = job.data;
    await Notification.create({ userId, content, title });
  },
  { connection }
);

notificationWorker.on("completed", (job) =>
  console.log("✅ Completed", job.date, job.id)
);
notificationWorker.on("failed", (job, err) =>
  console.error("❌ Failed", job?.data, job?.id, err)
);
