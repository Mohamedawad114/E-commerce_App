import verifyToken, {
  validationAdmin,
} from "../../../middlwares/auth.middleware.js";
import { validate } from "../../../middlwares/validation.middleware.js";
import { checkQuery } from "../../../utils/validators Schema/category.schema.js";
import { checkParams } from "../../../utils/validators Schema/users.Schema.js";
import * as services from "./services/admin.services.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/",
  verifyToken,
  validationAdmin,
  validate(checkQuery),
  services.gertusers
);

/**
 * @swagger
 * /admin/BannedUsers:
 *   get:
 *     summary: Get banned users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of banned users
 */
router.get("/BannedUsers", verifyToken, validationAdmin, services.BannesUsers);

/**
 * @swagger
 * /admin/user{/:id}:
 *   get:
 *     summary: Get single user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 */
router.get("/user{/:id}", verifyToken, validationAdmin, services.gertuser);

/**
 * @swagger
 * /admin/delete/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete(
  "/delete/:id",
  verifyToken,
  validationAdmin,
  validate(checkParams),
  services.deleteUser
);

/**
 * @swagger
 * /admin/bann/{id}:
 *   delete:
 *     summary: Ban a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User banned successfully
 */
router.delete(
  "/bann/:id",
  verifyToken,
  validationAdmin,
  validate(checkParams),
  services.BannUser
);

/**
 * @swagger
 * /admin/unbann/{id}:
 *   put:
 *     summary: Unban a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User unbanned successfully
 */
router.put(
  "/unbann/:id",
  verifyToken,
  validationAdmin,
  validate(checkParams),
  services.UnBannUser
);

export default router;
 