import { Router } from "express";
import * as services from "../services/auth.services.js";
import { validate } from "../../../../middlwares/validation.middleware.js";
import {
  confirmEmailSchema,
  loginSchema,
  resendOTPSchema,
  signupSchema,
} from "../../../../utils/validators Schema/users.Schema.js";
const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signupSchema'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/signup", validate(signupSchema), services.signup);

/**
 * @swagger
 * /auth/confirmEmail:
 *   post:
 *     summary: Confirm user email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/confirmEmailSchema'
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 */
router.post(
  "/confirmEmail",
  validate(confirmEmailSchema),
  services.confrim_email
);

/**
 * @swagger
 * /auth/resendOTP:
 *   get:
 *     summary: Resend OTP to confirm email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Registered user email
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */
router.get("/resendOTP", validate(resendOTPSchema), services.resendOTP);

/**
 * @swagger
 * /auth/signup-gmail:
 *   post:
 *     summary: Signup using Google account
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User signed up with Google successfully
 */
router.post("/signup-gmail", services.signWithGoogle);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginSchema'
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/login", validate(loginSchema), services.loginuser);

/**
 * @swagger
 * /auth/refreshToken:
 *   get:
 *     summary: Refresh authentication token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.get("/refreshToken", services.refreshToken);

export default router;
