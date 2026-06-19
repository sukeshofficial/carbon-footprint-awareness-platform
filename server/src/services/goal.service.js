import goalRepository from '../infrastructure/repositories/goal.repository.js';
import AppError from '../utils/appError.js';

class GoalService {
  async createGoal(userId, goalData) {
    // Check if user already has an active goal
    const activeGoal = await goalRepository.findActiveByUserId(userId);
    if (activeGoal) {
      // For MVP, we might only allow one active goal at a time
      // Or we can just let it be. Let's allow multiple goals but one primary one can be selected in UI.
    }

    const { title, description, targetType, targetValue, startDate, endDate } = goalData;

    if (!title || !targetType || targetValue === undefined || !startDate) {
      throw new AppError('Missing required goal fields', 400);
    }

    return await goalRepository.create({
      userId,
      title,
      description,
      targetType,
      targetValue,
      startDate,
      endDate: endDate || new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    });
  }

  async getGoals(userId) {
    return await goalRepository.findByUserId(userId);
  }

  async getActiveGoal(userId) {
    return await goalRepository.findActiveByUserId(userId);
  }

  async updateGoal(userId, id, updateData) {
    const goal = await goalRepository.findById(id);
    if (!goal || goal.userId.toString() !== userId.toString()) {
      throw new AppError('Goal not found or unauthorized', 404);
    }

    return await goalRepository.update(id, updateData);
  }

  async deleteGoal(userId, id) {
    const goal = await goalRepository.findById(id);
    if (!goal || goal.userId.toString() !== userId.toString()) {
      throw new AppError('Goal not found or unauthorized', 404);
    }

    return await goalRepository.delete(id);
  }
}

export default new GoalService();
