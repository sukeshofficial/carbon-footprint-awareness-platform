import CarbonEstimation from '../models/carbonEstimation.model.js';

class CarbonEstimationRepository {
  async saveEstimation(estimationData) {
    return await CarbonEstimation.create(estimationData);
  }

  async getLatestByUserId(userId) {
    return await CarbonEstimation.findOne({ userId }).sort({ calculatedAt: -1 });
  }

  async getHistoryByUserId(userId, limit = 10) {
    return await CarbonEstimation.find({ userId })
      .sort({ calculatedAt: -1 })
      .limit(limit);
  }

  async getById(id) {
    return await CarbonEstimation.findById(id);
  }

  async updateByUserId(userId, updateData) {
    return await CarbonEstimation.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, sort: { calculatedAt: -1 } }
    );
  }

  async updateById(id, updateData) {
    return await CarbonEstimation.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }
}

export default new CarbonEstimationRepository();
