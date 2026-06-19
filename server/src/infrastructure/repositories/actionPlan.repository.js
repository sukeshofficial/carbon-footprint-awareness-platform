import mongoose from 'mongoose';
import ActionPlan from '../models/actionPlan.model.js';
import logger from '../../utils/logger.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class ActionPlanRepository {
  async create(planData) {
    try {
      return await ActionPlan.create({
        userId: planData.userId,
        goalId: planData.goalId,
        planType: planData.planType,
        status: planData.status || 'active',
        aiRecommendations: planData.aiRecommendations
      });
    } catch (error) {
      logger.error('ActionPlanRepository.create error', { error });
      throw error;
    }
  }

  async findActiveByUserId(userId, planType) {
    try {
      if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
      const query = { userId, status: 'active' };
      if (planType) query.planType = String(planType);
      return await ActionPlan.findOne(query).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('ActionPlanRepository.findActiveByUserId error', { error, userId });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!isValidObjectId(id)) throw new Error('Invalid plan ID');
      return await ActionPlan.findById(id);
    } catch (error) {
      logger.error('ActionPlanRepository.findById error', { error, id });
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      if (!isValidObjectId(id)) throw new Error('Invalid plan ID');
      return await ActionPlan.findByIdAndUpdate(id, { status: String(status) }, { new: true });
    } catch (error) {
      logger.error('ActionPlanRepository.updateStatus error', { error, id });
      throw error;
    }
  }

  async findByGoalId(goalId) {
    try {
      if (!isValidObjectId(goalId)) throw new Error('Invalid goal ID');
      return await ActionPlan.find({ goalId }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('ActionPlanRepository.findByGoalId error', { error, goalId });
      throw error;
    }
  }
}

export default new ActionPlanRepository();
