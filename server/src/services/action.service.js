import actionRepository from '../infrastructure/repositories/action.repository.js';
import analyticsService from './analytics.service.js';
import goalRepository from '../infrastructure/repositories/goal.repository.js';
import AppError from '../utils/appError.js';

class ActionService {
  async getActions(userId, planId) {
    if (planId) {
      return await actionRepository.findByPlanId(planId);
    }
    return await actionRepository.findByUserId(userId);
  }

  async completeAction(userId, actionId) {
    const action = await actionRepository.findById(actionId);
    if (!action || action.userId.toString() !== userId.toString()) {
      throw new AppError('Action not found or unauthorized', 404);
    }

    if (action.status === 'completed') {
      throw new AppError('Action already completed', 400);
    }

    const updatedAction = await actionRepository.updateStatus(actionId, 'completed', new Date());

    // Update goal progress — use the active goal (planId already on action if needed later)
    const activeGoal = await goalRepository.findActiveByUserId(userId);
    if (activeGoal) {
      if (activeGoal.targetType === 'action_completion_count') {
        const newCount = (activeGoal.currentValue || 0) + 1;
        await goalRepository.updateCurrentValue(activeGoal._id, newCount);
      } else if (activeGoal.targetType === 'footprint_reduction_percent') {
        // This is more complex, usually updated by analytics service
      }
    }

    // Trigger analytics re-calculation
    await analyticsService.updateProgressSnapshot(userId, activeGoal?._id);

    return updatedAction;
  }

  async skipAction(userId, actionId) {
    const action = await actionRepository.findById(actionId);
    if (!action || action.userId.toString() !== userId.toString()) {
      throw new AppError('Action not found or unauthorized', 404);
    }

    return await actionRepository.updateStatus(actionId, 'skipped');
  }

  async getTodayAction(userId) {
    return await actionRepository.findTodayAction(userId);
  }
}

export default new ActionService();
