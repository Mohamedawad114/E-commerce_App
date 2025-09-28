import * as services from "./services/adminProduct.services.js";
import verifyToken, {
  validationAdmin,
} from "../../../middlwares/auth.middleware.js";
import { Router } from "express";
import { uploadFiles } from "../../../middlwares/upload.multer.js";
import { validate } from "../../../middlwares/validation.middleware.js";
import {
  checkParams,
  checkQuery,
  productSchema,
  updateProductSchema,
  categoryProductSchema,
} from "../../../utils/index.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdminProducts
 *   description: Admin product management
 */

/**
 * @swagger
 * /adminProducts/add:
 *   post:
 *     summary: Add a new product
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post(
  "/add",
  verifyToken,
  validationAdmin,
  validate(productSchema),
  services.addProduct
);

/**
 * @swagger
 * /adminProducts/{id}/photo:
 *   post:
 *     summary: Upload product photos
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Photos uploaded successfully
 */
router.post(
  "/:id/photo",
  verifyToken,
  validationAdmin,
  validate(checkParams),
  uploadFiles.array("images", 4),
  services.uploadPhotos
);

/**
 * @swagger
 * /adminProducts/{id}/update:
 *   put:
 *     summary: Update a product
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put(
  "/:id/update",
  verifyToken,
  validationAdmin,
  validate(updateProductSchema),
  services.updateProduct
);

/**
 * @swagger
 * /adminProducts/{id}:
 *   get:
 *     summary: Get product details
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
router.get(
  "/:id",
  verifyToken,
  validationAdmin,
  validate(checkParams),
  services.getProduct
);

/**
 * @swagger
 * /adminProducts/serch:
 *   get:
 *     summary: Search products
 *     tags: [AdminProducts]
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
router.get(
  "/search",
  verifyToken,
  validationAdmin,
  validate(checkQuery),
  services.search
);

/**
 * @swagger
 * /adminProducts/{id}:
 *   post:
 *     summary: Add products to category
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Products added to category successfully
 */
router.get(
  "/category/:categoryId",
  verifyToken,
  validationAdmin,
  validate(categoryProductSchema),
  services.categotyProducts
);
/**
 * @swagger
 * /adminProducts/{id}/delete:
 *   delete:
 *     summary: Delete a product
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete(
  "/:id/delete",
  verifyToken,
  validationAdmin,
  validate(checkParams),
  services.deleteProduct
);

export default router;
