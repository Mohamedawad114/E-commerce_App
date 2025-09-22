import Redis from "ioredis";
import env from "dotenv";
env.config();

export const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
