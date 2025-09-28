import verifyToken from "../../middlwares/auth.middleware.js";
import { verifyReview_owner } from "../../middlwares/reviewOwner.middleware.js";
import { validate } from "../../middlwares/validation.middleware.js";
import { addReview, reviewId, updateReview } from "../../utils/index.js";
import * as services from "./services/review.services.js";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews management
 */


/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */
router.get("/:reviewId", verifyToken, validate(reviewId),verifyReview_owner, services.getReview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/product/:productId", verifyToken, services.allReviewProduct);

/**
 * @swagger
 * /reviews/add:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router.post("/add/:id", verifyToken, validate(addReview), services.addReview);

/**
 * @swagger
 * /reviews/{id}/update:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
router.put(
  "/:reviewId/update",
  verifyToken,
  verifyReview_owner,
  validate(updateReview),
  services.updateReview
);

/**
 * @swagger
 * /reviews/{id}/delete:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
router.delete(
  "/:reviewId/delete",
  verifyToken,
  validate(reviewId),
  verifyReview_owner,
  services.deleteReview
);

export default router;
