import mongoose from 'mongoose';
import Action from '../models/action.model.js';
import logger from '../../utils/logger.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/** Allowlisted status values — prevents arbitrary user-controlled strings in queries. */
const VALID_STATUSES = new Set(['pending', 'completed', 'skipped']);

/**
 * Builds a safe status filter.
 * @param {string|undefined} status
 * @returns {{ status: string }|{}} - filter fragment, or empty object if no status given
 */
function buildStatusFilter(status) {
  if (!status) return {};
  const normalised = String(status).toLowerCase();
  if (!VALID_STATUSES.has(normalised)) {
    throw new Error(`Invalid status value: "${status}"`);
  }
  return { status: normalised };
}

class ActionRepository {
  async create(actionData) {
    try {
      return await Action.create({
        planId: actionData.planId,
        userId: actionData.userId,
        title: actionData.title,
        description: actionData.description,
        impactEstimate: actionData.impactEstimate,
        effortLevel: actionData.effortLevel,
        scheduledDate: actionData.scheduledDate,
        status: actionData.status || 'pending',
        category: actionData.category,
        carbonUnit: actionData.carbonUnit,
        savingsCurrencyEstimate: actionData.savingsCurrencyEstimate
      });
    } catch (error) {
      logger.error('ActionRepository.create error', { error, userId: actionData.userId });
      throw error;
    }
  }

  async createMany(actions) {
    try {
      const sanitizedActions = actions.map(action => ({
        planId: action.planId,
        userId: action.userId,
        title: action.title,
        description: action.description,
        impactEstimate: action.impactEstimate,
        effortLevel: action.effortLevel,
        scheduledDate: action.scheduledDate,
        status: action.status || 'pending',
        category: action.category,
        carbonUnit: action.carbonUnit,
        savingsCurrencyEstimate: action.savingsCurrencyEstimate
      }));
      return await Action.insertMany(sanitizedActions);
    } catch (error) {
      logger.error('ActionRepository.createMany error', { error });
      throw error;
    }
  }

  async findByPlanId(planId) {
    try {
      if (!isValidObjectId(planId)) throw new Error('Invalid plan ID');
      return await Action.find({ planId }).sort({ scheduledDate: 1 });
    } catch (error) {
      logger.error('ActionRepository.findByPlanId error', { error, planId });
      throw error;
    }
  }

  async findByUserId(userId, status) {
    try {
      if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
      const query = { userId, ...buildStatusFilter(status) };
      return await Action.find(query).sort({ scheduledDate: 1 });
    } catch (error) {
      logger.error('ActionRepository.findByUserId error', { error, userId });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!isValidObjectId(id)) throw new Error('Invalid action ID');
      return await Action.findById(id);
    } catch (error) {
      logger.error('ActionRepository.findById error', { error, id });
      throw error;
    }
  }

  async updateStatus(id, status, completedAt = null) {
    try {
      if (!isValidObjectId(id)) throw new Error('Invalid action ID');
      const update = { status: String(status) };
      if (completedAt) update.completedAt = completedAt;
      return await Action.findByIdAndUpdate(id, update, { new: true });
    } catch (error) {
      logger.error('ActionRepository.updateStatus error', { error, id });
      throw error;
    }
  }

  async findTodayAction(userId) {
    try {
      if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      return await Action.findOne({
        userId,
        scheduledDate: { $gte: startOfDay, $lte: endOfDay }
      });
    } catch (error) {
      logger.error('ActionRepository.findTodayAction error', { error, userId });
      throw error;
    }
  }

  async findByDateRange(userId, startDate, endDate) {
    try {
      if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
      return await Action.find({
        userId,
        scheduledDate: { $gte: startDate, $lte: endDate }
      }).sort({ scheduledDate: 1 });
    } catch (error) {
      logger.error('ActionRepository.findByDateRange error', { error, userId });
      throw error;
    }
  }
}

export default new ActionRepository();
