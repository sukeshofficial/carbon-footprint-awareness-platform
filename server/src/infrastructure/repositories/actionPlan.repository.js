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
      const safeUserId = isValidObjectId(userId) ? new mongoose.Types.ObjectId(String(userId)) : userId;
      const query = { userId: safeUserId, status: 'active' };
      if (planType) query.planType = String(planType);
      return await ActionPlan.findOne(query).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('ActionPlanRepository.findActiveByUserId error', { error, userId });
      throw error;
    }
  }

  async findById(id) {
    try {
      const safeId = isValidObjectId(id) ? new mongoose.Types.ObjectId(String(id)) : id;
      return await ActionPlan.findById(safeId);
    } catch (error) {
      logger.error('ActionPlanRepository.findById error', { error, id });
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      const safeId = isValidObjectId(id) ? new mongoose.Types.ObjectId(String(id)) : id;
      return await ActionPlan.findByIdAndUpdate(safeId, { status: String(status) }, { new: true });
    } catch (error) {
      logger.error('ActionPlanRepository.updateStatus error', { error, id });
      throw error;
    }
  }

  async findByGoalId(goalId) {
    try {
      const safeGoalId = isValidObjectId(goalId) ? new mongoose.Types.ObjectId(String(goalId)) : goalId;
      return await ActionPlan.find({ goalId: safeGoalId }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('ActionPlanRepository.findByGoalId error', { error, goalId });
      throw error;
    }
  }
}

export default new ActionPlanRepository();
