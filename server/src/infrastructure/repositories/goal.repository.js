import mongoose from 'mongoose';
import Goal from '../models/goal.model.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));

class GoalRepository {
  async create(goalData) {
    return await Goal.create(goalData);
  }

  async findByUserId(userId) {
    const safeUserId = isValidObjectId(userId) ? toObjectId(userId) : userId;
    return await Goal.find({ userId: safeUserId }).sort({ createdAt: -1 });
  }

  async findActiveByUserId(userId) {
    const safeUserId = isValidObjectId(userId) ? toObjectId(userId) : userId;
    return await Goal.findOne({ userId: safeUserId, status: 'active' });
  }

  async findById(id) {
    const safeId = isValidObjectId(id) ? toObjectId(id) : id;
    return await Goal.findById(safeId);
  }

  async update(id, updateData) {
    const safeId = isValidObjectId(id) ? toObjectId(id) : id;
    return await Goal.findByIdAndUpdate(safeId, updateData, { new: true });
  }

  async delete(id) {
    const safeId = isValidObjectId(id) ? toObjectId(id) : id;
    return await Goal.findByIdAndDelete(safeId);
  }

  async updateCurrentValue(id, value) {
    const safeId = isValidObjectId(id) ? toObjectId(id) : id;
    return await Goal.findByIdAndUpdate(
      safeId,
      { $set: { currentValue: value } },
      { new: true }
    );
  }
}

export default new GoalRepository();
