import RateLimit from "express-rate-limit";

export const limiter = RateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 2000,
  message: "too many requests,try after 10 minutes",
  legacyHeaders: false,
});
