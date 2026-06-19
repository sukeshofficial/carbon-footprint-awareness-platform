import Action from '../models/action.model.js';

class ActionRepository {
  async create(actionData) {
    return await Action.create(actionData);
  }

  async createMany(actions) {
    return await Action.insertMany(actions);
  }

  async findByPlanId(planId) {
    return await Action.find({ planId }).sort({ scheduledDate: 1 });
  }

  async findByUserId(userId, status) {
    const query = { userId };
    if (status) query.status = status;
    return await Action.find(query).sort({ scheduledDate: 1 });
  }

  async findById(id) {
    return await Action.findById(id);
  }

  async updateStatus(id, status, completedAt = null) {
    const update = { status };
    if (completedAt) update.completedAt = completedAt;
    return await Action.findByIdAndUpdate(id, update, { new: true });
  }

  async findTodayAction(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await Action.findOne({
      userId,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay }
    });
  }

  async findByDateRange(userId, startDate, endDate) {
    return await Action.find({
      userId,
      scheduledDate: { $gte: startDate, $lte: endDate }
    }).sort({ scheduledDate: 1 });
  }
}

export default new ActionRepository();
