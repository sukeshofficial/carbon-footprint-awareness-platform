import Recommendation from '../models/recommendation.model.js';

class RecommendationRepository {
  async saveRecommendation(recommendationData) {
    return await Recommendation.create(recommendationData);
  }

  async saveMany(recommendations) {
    return await Recommendation.insertMany(recommendations);
  }

  async getActiveByUserId(userId) {
    return await Recommendation.find({ userId, status: 'active' }).sort({ rankScore: -1 });
  }

  async getByUserId(userId, status) {
    const query = { userId };
    if (status) query.status = status;
    return await Recommendation.find(query).sort({ updatedAt: -1 });
  }

  async getTopPriorityByUserId(userId) {
    return await Recommendation.find({ userId, status: 'active', isTopPriority: true })
      .sort({ rankScore: -1 })
      .limit(3);
  }

  async getById(id) {
    return await Recommendation.findById(id);
  }

  async updateStatus(id, status) {
    return await Recommendation.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
  }

  async deleteByUserId(userId) {
    return await Recommendation.deleteMany({ userId, status: 'active' });
  }

  async getHistoryByUserId(userId) {
    return await Recommendation.find({
      userId,
      status: { $in: ['accepted', 'completed', 'dismissed'] }
    }).sort({ updatedAt: -1 });
  }
}

export default new RecommendationRepository();
