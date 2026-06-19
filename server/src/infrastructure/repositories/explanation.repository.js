import CarbonExplanation from '../models/explanation.model.js';

class ExplanationRepository {
  async save(data) {
    const explanation = new CarbonExplanation(data);
    return await explanation.save();
  }

  async getLatestByUserId(userId) {
    return await CarbonExplanation.findOne({ userId }).sort({ createdAt: -1 });
  }

  async getByEstimationId(estimationId) {
    return await CarbonExplanation.findOne({ estimationId });
  }
}

export default new ExplanationRepository();
