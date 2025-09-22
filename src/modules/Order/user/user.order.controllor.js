import { Router } from "express";
import * as services from "./services/user.order.services.js";
import verifyToken from "../../../middlwares/auth.middleware.js";
import { validate } from "../../../middlwares/validation.middleware.js";
import { orderIdSchema, orderSchema } from "../../../utils/index.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: UserOrders
 *   description: User order management
 */

/**
 * @swagger
 * /userOrders/create:
 *   post:
 *     summary: Create a new order
 *     tags: [UserOrders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post(
  "/create",
  verifyToken,
  validate(orderSchema),
  services.createOrder
);

/**
 * @swagger
 * /userOrders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [UserOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 */
router.get("/:id", verifyToken, validate(orderIdSchema), services.getOrder);

/**
 * @swagger
 * /userOrders/myOrderS:
 *   get:
 *     summary: Get all orders for logged in user
 *     tags: [UserOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */
router.get("/", verifyToken, services.getOrders);

/**
 * @swagger
 * /userOrders/{id}/cancel:
 *   delete:
 *     summary: Cancel an order
 *     tags: [UserOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order canceled successfully
 */
router.delete("/:id/cancel", verifyToken, services.cancelOrder);

export default router;
