import * as services from "./services/userProducts.services.js";
import verifyToken from "../../../middlwares/auth.middleware.js";
import { validate } from "../../../middlwares/validation.middleware.js";
import { Router } from "express";
import { checkParams } from "../../../utils/index.js";

const router = Router();

/**
 * @swagger
 * /userProducts/topSelling:
 *   get:
 *     summary: Get top selling products
 *     tags: [UserProducts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top selling products
 */
router.get("/topSelling", verifyToken, services.topSelling_products);

/**
 * @swagger
 * /userProducts/topRating:
 *   get:
 *     summary: Get top rating products
 *     tags: [UserProducts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top rated products
 */
router.get("/topRating", verifyToken, services.topRating_products);

/**
 * @swagger
 * /userProducts/search:
 *   get:
 *     summary: Search products
 *     tags: [UserProducts]
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
 *         description: Search results
 */
router.get("/search", verifyToken, services.search);

/**
 * @swagger
 * /userProducts/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [UserProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/:id", verifyToken, validate(checkParams), services.getProduct);

/**
 * @swagger
 * /userProducts/{id}/summary:
 *   get:
 *     summary: Get product summary by ID
 *     tags: [UserProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product summary
 */
router.get(
  "/:id/summary",
  verifyToken,
  validate(checkParams),
  services.getProductSummary
);

/**
 * @swagger
 * /userProducts/{id}/list:
 *   get:
 *     summary: Get products for a category (sorted)
 *     tags: [UserProducts]
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
 *         description: List of products in the category
 */
router.get(
  "/:id/list",
  verifyToken,
  validate(checkParams),
  services.categotyProducts_sorted
);

/**
 * @swagger
 * /userProducts/{id}/topRating:
 *   get:
 *     summary: Get top rating products in a category
 *     tags: [UserProducts]
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
 *         description: Top rated products for category
 */
router.get(
  "/:id/topRating",
  verifyToken,
  validate(checkParams),
  services.topRating_products_forCategory
);

/**
 * @swagger
 * /userProducts/{id}/topSelling:
 *   get:
 *     summary: Get top selling products in a category
 *     tags: [UserProducts]
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
 *         description: Top selling products for category
 */
router.get(
  "/:id/topSelling",
  verifyToken,
  validate(checkParams),
  services.topselling_products_forCategory
);

export default router;
