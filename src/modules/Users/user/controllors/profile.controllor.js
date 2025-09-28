import { Router } from "express";
import * as services from "../services/profile.services.js";
import { validate } from "../../../../middlwares/validation.middleware.js";
import {
  resetPasswordSchema,
  updatePasswordSchema,
  updateSchema,
} from "../../../../utils/validators Schema/users.Schema.js";
import verifyToken from "../../../../middlwares/auth.middleware.js";
import { uploadFile } from "../../../../middlwares/upload.multer.js";

const router = Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get("/", verifyToken, services.profile);

/**
 * @swagger
 * /profile/photo:
 *   post:
 *     summary: Upload or update profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
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
 *         description: Profile photo uploaded successfully
 */
router.post(
  "/photo",
  verifyToken,
  uploadFile.single("image"),
  services.uploadphoto
);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update user profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateSchema'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.put("/update", verifyToken, validate(updateSchema), services.updateuser);

/**
 * @swagger
 * /profile/updatePassword:
 *   put:
 *     summary: Update user password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updatePasswordSchema'
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.put(
  "/updatePassword",
  verifyToken,
  validate(updatePasswordSchema),
  services.updatePassword
);

/**
 * @swagger
 * /profile/resetPasswordreq:
 *   get:
 *     summary: Request password reset (send OTP)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully
 */
router.get("/resetPasswordreq", verifyToken, services.resetPasswordreq);

/**
 * @swagger
 * /profile/resendOTPReset:
 *   get:
 *     summary: Resend OTP for password reset
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */
router.get("/resendOTPReset", verifyToken, services.resendOTP_reset);

/**
 * @swagger
 * /profile/notification:
 *   get:
 *     summary: notification which user not read
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: notification
 */

router.get("/notifications", verifyToken, services.Notifications);

/**
 * @swagger
 * /profile/resetPassword:
 *   put:
 *     summary: Reset user password using OTP
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resetPasswordSchema'
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.put(
  "/resetPassword",
  verifyToken,
  validate(resetPasswordSchema),
  services.resetPasswordconfrim
);

/**
 * @swagger
 * /profile/deleteAccount:
 *   delete:
 *     summary: Delete user account
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete("/deleteAccount", verifyToken, services.deleteAccount);

/**
 * @swagger
 * /profile/logout:
 *   delete:
 *     summary: Logout from current device
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.delete("/logout", verifyToken, services.logout);

/**
 * @swagger
 * /profile/logoutAllDevices:
 *   delete:
 *     summary: Logout from all devices
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices successfully
 */
router.delete("/logoutAllDevices", verifyToken, services.logoutAllDevices);

export default router;
