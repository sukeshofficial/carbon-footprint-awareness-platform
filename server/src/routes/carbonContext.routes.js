import express from 'express';
import carbonContextController from '../controllers/carbonContext.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All onboarding routes require authentication
router.use(protect);

router.get('/questions', carbonContextController.getQuestions);
router.get('/responses/me', carbonContextController.getMyResponses);
router.patch('/responses/step/:stepKey', carbonContextController.updateStep);
router.patch('/responses/step/:stepKey/skip', carbonContextController.skipStep);
router.post('/complete', carbonContextController.completeOnboarding);

export default router;
