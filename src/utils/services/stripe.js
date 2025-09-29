import Stripe from "stripe";
import env from "dotenv";
env.config({ path: "./.dev.env" });

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}
const stripe_key = process.env.STRIPE_SECRET_KEY
export const stripe = new Stripe(stripe_key);
