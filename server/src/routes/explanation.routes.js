import express from 'express';
import explanationController from '../controllers/explanation.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/v1/explanations/me
router.get('/me', protect, explanationController.getMyExplanation);

export default router;
