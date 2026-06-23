import express from 'express';
import authController from '../controllers/AuthController.js';
import googleController from '../controllers/GoogleController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../shared/schemas/auth.schemas.js';

const router = express.Router();

// Email Auth
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', protect, authController.resendVerification);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', protect, authController.logoutAll);
router.get('/me', protect, authController.getMe);
router.patch('/me', protect, authController.updateMe);

// Forgot/Reset Password
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

// Google OAuth
router.get('/google', googleController.googleAuth);
router.get('/google/callback', googleController.googleCallback);

export default router;
