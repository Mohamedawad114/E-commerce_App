import Redis from "ioredis";
import env from "dotenv";
env.config({ path: "./dev.env" });

export const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
