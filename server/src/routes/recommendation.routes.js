import express from 'express';
import recommendationController from '../controllers/recommendation.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', recommendationController.getRecommendations.bind(recommendationController));
router.post('/refresh', recommendationController.refreshRecommendations.bind(recommendationController));
router.patch('/:id/status', recommendationController.updateStatus.bind(recommendationController));
router.get('/history', recommendationController.getHistory.bind(recommendationController));

export default router;
