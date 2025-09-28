import verifyToken from "../../middlwares/auth.middleware.js";
import * as services from "./services/payment.services.js";
import { Router } from "express";
import express from "express";

const router = Router();

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create a Stripe Payment Intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "64f9e6a2c2b4e234abcd1234"
 *     responses:
 *       200:
 *         description: Payment Intent created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client_secret:
 *                   type: string
 *                   example: "pi_1HXXXX_secret_XXXX"
 */
router.post("/checkout", verifyToken, services.createpayment);

/**
 * @swagger
 * /webhook:
 *   post:
 *     summary: Stripe Webhook endpoint
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  services.webhooks
);

export default router;
