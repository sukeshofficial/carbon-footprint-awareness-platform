import goalService from '../services/goal.service.js';
import catchAsync from '../utils/catchAsync.js';

class GoalController {
  createGoal = catchAsync(async (req, res) => {
    const goal = await goalService.createGoal(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      data: { goal }
    });
  });

  getGoals = catchAsync(async (req, res) => {
    const goals = await goalService.getGoals(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { goals }
    });
  });

  getActiveGoal = catchAsync(async (req, res) => {
    const goal = await goalService.getActiveGoal(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { goal }
    });
  });

  updateGoal = catchAsync(async (req, res) => {
    const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: { goal }
    });
  });

  deleteGoal = catchAsync(async (req, res) => {
    await goalService.deleteGoal(req.user.id, req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
}

export default new GoalController();
