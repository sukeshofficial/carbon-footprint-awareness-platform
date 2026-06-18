import RecommendationFeedback from '../models/recommendationFeedback.model.js';

class RecommendationFeedbackRepository {
  async logFeedback(feedbackData) {
    return await RecommendationFeedback.create(feedbackData);
  }

  async getFeedbackByUserId(userId) {
    return await RecommendationFeedback.find({ userId }).sort({ createdAt: -1 });
  }

  async getFeedbackByRecommendationId(recommendationId) {
    return await RecommendationFeedback.find({ recommendationId }).sort({ createdAt: -1 });
  }
}

export default new RecommendationFeedbackRepository();
