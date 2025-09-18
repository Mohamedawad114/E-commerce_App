import verifyToken from "../../../middlwares/auth.middleware.js";
import { validate } from "../../../middlwares/validation.middleware.js";
import { checkQuery, checkParams } from "../../../utils/index.js";
import * as services from "./services/user_category.services.js";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: UserCategories
 *   description: Public category browsing
 */

/**
 * @swagger
 * /userCategories:
 *   get:
 *     summary: Get all categories
 *     tags: [UserCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", verifyToken, validate(checkQuery), services.allCategories);

/**
 * @swagger
 * /userCategories/search:
 *   get:
 *     summary: Search categories
 *     tags: [UserCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of categories matching search
 */
router.get("/search", verifyToken, validate(checkQuery), services.search);

/**
 * @swagger
 * /userCategories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [UserCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 */
router.get("/:id", verifyToken, validate(checkParams), services.getCategory);

export default router;
