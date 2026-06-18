import express from 'express';
import plannerController from '../controllers/planner.controller.js';
import actionController from '../controllers/action.controller.js';
import streakController from '../controllers/streak.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Plans
router.post('/generate', plannerController.generatePlan);

// Actions
router.get('/actions', actionController.getActions);
router.get('/actions/today', actionController.getTodayAction);
router.patch('/actions/:id/complete', actionController.completeAction);
router.patch('/actions/:id/skip', actionController.skipAction);

// Streaks
router.get('/streaks', streakController.getStreak);

// Analytics
router.get('/analytics/progress', plannerController.getAnalytics);
router.post('/analytics/refresh', plannerController.refreshAnalytics);

export default router;
