import express from 'express';
import profileController from '../controllers/profile.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/me', profileController.createProfileController);
router.get('/me', profileController.getProfileController);
router.put('/me', profileController.updateProfileController);
router.patch('/me/preferences', profileController.patchPreferencesController);

export default router;
