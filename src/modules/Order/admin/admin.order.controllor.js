import verifyToken, {
  validationAdmin,
} from "../../../middlwares/auth.middleware.js";
import * as services from "./services/admin.order.services.js";
import { Router } from "express";
const router = Router();
/**
 * @swagger
 * tags:
 *   name: AdminOrders
 *   description: Admin order management
 */

/**
 * @swagger
 * /adminOrders/orderPending:
 *   get:
 *     summary: Get all pending orders
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending orders
 */
router.get(
  "/orderPending",
  verifyToken,
  validationAdmin,
  services.orderPending
);

/**
 * @swagger
 * /adminOrders/orderConfirmed:
 *   get:
 *     summary: Get all confirmed orders
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of confirmed orders
 */
router.get(
  "/orderConfirmed",
  verifyToken,
  validationAdmin,
  services.orderconfirm
);

/**
 * @swagger
 * /adminOrders/orderPerDay:
 *   get:
 *     summary: Get number of orders grouped by day
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders statistics per day
 */
router.get("/orderPerDay", verifyToken, validationAdmin, services.ordersPerDay);

/**
 * @swagger
 * /adminOrders/orderPerMonth:
 *   get:
 *     summary: Get number of orders grouped by month
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders statistics per month
 */
router.get(
  "/orderPerMonth",
  verifyToken,
  validationAdmin,
  services.ordersPerMonth
);

export default router;
