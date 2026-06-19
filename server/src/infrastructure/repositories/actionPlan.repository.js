import ActionPlan from '../models/actionPlan.model.js';

class ActionPlanRepository {
  async create(planData) {
    return await ActionPlan.create(planData);
  }

  async findActiveByUserId(userId, planType) {
    const query = { userId, status: 'active' };
    if (planType) query.planType = planType;
    return await ActionPlan.findOne(query).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await ActionPlan.findById(id);
  }

  async updateStatus(id, status) {
    return await ActionPlan.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findByGoalId(goalId) {
    return await ActionPlan.find({ goalId }).sort({ createdAt: -1 });
  }
}

export default new ActionPlanRepository();
