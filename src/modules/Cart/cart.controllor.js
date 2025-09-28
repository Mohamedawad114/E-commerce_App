import verifyToken from "../../middlwares/auth.middleware.js";
import { validate } from "../../middlwares/validation.middleware.js";
import { cartSchema } from "../../utils/index.js";
import * as services from "./services/cart.services.js";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartInput'
 *     responses:
 *       201:
 *         description: Product added to cart
 */
router.post("/add", verifyToken, validate(cartSchema), services.addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart details
 */
router.get("/", verifyToken, services.userCart);

/**
 * @swagger
 * /cart/summary:
 *   get:
 *     summary: Get cart summary (total price & items count)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart summary
 */
router.get("/summary", verifyToken, services.summaryCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartInput'
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.put("/update", verifyToken, validate(cartSchema), services.updateCart);

/**
 * @swagger
 * /cart/All:
 *   delete:
 *     summary: Remove all products from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete("/All", verifyToken, services.removeAllFromCart);

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed
 */
router.delete("/remove", verifyToken, services.removeFromCart);

export default router;
