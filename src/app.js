import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import env from "dotenv";
import morgan from "morgan";
import cors from "cors";
import db_connection from "./DB/db.connection.js";
import { app_router } from "./modules/controllor.index.js";
import { serverAdapter } from "./Queues/bullboard.js";
import { swaggerDocs } from "../swagger.js";
import { limiter } from "./utils/index.js";
env.config({ path: "./.dev.env" });

const app = express();
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONT,
  })
);
swaggerDocs(app);

app.get("/", (req, res) => {
  res.send("مرحبا 👋 Welcome to E-commerce_App");
});

app.use("/api/profile", app_router.userRouter);
app.use("/api/auth", app_router.authRouter);
app.use("/api/admin/users", app_router.adminRouter);

app.use("/api/categories", app_router.userCategoryRouter);
app.use("/api/admin/categories", app_router.adminCategoryRouter);

app.use("/api/products", app_router.userProductRouter);
app.use("/api/admin/products", app_router.adminProductRouter);

app.use("/api/wishlist", app_router.wishlistRouter);
app.use("/api/reviews", app_router.reviewRouter);
app.use("/api/cart", app_router.cartRouter);

app.use("/api/Orders", app_router.userOder_Router);
app.use("/api/admin/Orders", app_router.adminOrder_Router);

app.use("/api/payments", app_router.payment_Router);

app.use("/admin/queues", serverAdapter.getRouter());
app.use(limiter);

db_connection();
app.use(async (err, req, res, next) => {
  if (req.session && req.session.inTransaction()) {
    await req.session.abortTransaction();
    req.session.endSession();
  }
  res
    .status(err.cause || 500)
    .json({ message: `something wrong`, err: err.message, stack: err.stack });
});

app.use((req, res) => {
  res.status(404).json({ message: `Page Not Found` });
});

export default app;
