import * as services from "./services/admin._category.services.js";
import { Router } from "express";
import verifyToken from "../../../middlwares/auth.middleware.js";
import { validationAdmin } from "../../../middlwares/auth.middleware.js";
import { validate } from "../../../middlwares/validation.middleware.js";
import {
  checkParams,
  CategorySchema,
  checkQuery,
  updateCategorySchema,
} from "../../../utils/index.js";
import { uploadFile } from "../../../middlwares/upload.multer.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdminCategories
 *   description: Category management by Admin
 */

/**
 * @swagger
 * /adminCategories/add:
 *   post:
 *     summary: Add a new category
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post("/add", verifyToken, validationAdmin, validate(CategorySchema), services.addCategory);

/**
 * @swagger
 * /adminCategories/{id}/photo:
 *   post:
 *     summary: Upload a photo for category
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post(
  "/:id/photo",
  verifyToken,
  validationAdmin,
  validate(checkParams),
  uploadFile.single("image"),
  services.photoCategory
);

/**
 * @swagger
 * /adminCategories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 */
router.get("/:id", verifyToken, validationAdmin, validate(checkParams), services.getCategory);

/**
 * @swagger
 * /adminCategories/{id}/update:
 *   put:
 *     summary: Update category by ID
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/:id/update", verifyToken, validationAdmin, validate(checkParams), validate(updateCategorySchema), services.updateCategory);

/**
 * @swagger
 * /adminCategories/{id}/delete:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete("/:id/delete", verifyToken, validationAdmin, validate(checkParams), services.deleteCategory);

/**
 * @swagger
 * /adminCategories:
 *   post:
 *     summary: Get all categories (with optional filters)
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryQuery'
 *     responses:
 *       200:
 *         description: List of categories
 */
router.post("/", verifyToken, validationAdmin, validate(checkQuery), services.allCategories);


export default router;
