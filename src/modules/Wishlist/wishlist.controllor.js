import verifyToken from "../../middlwares/auth.middleware.js";
import { validate } from "../../middlwares/validation.middleware.js";
import { checkParams } from "../../utils/validators Schema/users.Schema.js";
import * as services from "./services/wishlist.services.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /wishlist/{id}:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *       400:
 *         description: Invalid request
 */
router.post(
  "/:id",
  verifyToken,
  validate(checkParams),
  services.addToWishlist
);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist products
 */
router.get("/", verifyToken, services.getWishlist);

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       404:
 *         description: Product not found in wishlist
 */
router.delete(
  "/:id",
  verifyToken,
  validate(checkParams),
  services.removeFromWishlist
);

export default router;
