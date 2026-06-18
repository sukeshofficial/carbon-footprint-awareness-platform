import express from 'express';
import goalController from '../controllers/goal.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', goalController.createGoal);
router.get('/', goalController.getGoals);
router.get('/active', goalController.getActiveGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

export default router;
