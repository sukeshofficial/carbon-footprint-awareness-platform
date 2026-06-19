import Goal from '../models/goal.model.js';

class GoalRepository {
  async create(goalData) {
    return await Goal.create(goalData);
  }

  async findByUserId(userId) {
    return await Goal.find({ userId }).sort({ createdAt: -1 });
  }

  async findActiveByUserId(userId) {
    return await Goal.findOne({ userId, status: 'active' });
  }

  async findById(id) {
    return await Goal.findById(id);
  }

  async update(id, updateData) {
    return await Goal.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Goal.findByIdAndDelete(id);
  }

  async updateCurrentValue(id, value) {
    return await Goal.findByIdAndUpdate(
      id,
      { $set: { currentValue: value } },
      { new: true }
    );
  }
}

export default new GoalRepository();
