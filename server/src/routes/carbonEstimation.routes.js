import express from 'express';
import carbonEstimationController from '../controllers/carbonEstimation.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/me', carbonEstimationController.getMyEstimation);
router.get('/me/insights', carbonEstimationController.getMyInsights);
router.get('/me/insights/stream', carbonEstimationController.streamMyInsights);
router.post('/recalculate', carbonEstimationController.recalculate);
router.get('/history', carbonEstimationController.getHistory);

export default router;
