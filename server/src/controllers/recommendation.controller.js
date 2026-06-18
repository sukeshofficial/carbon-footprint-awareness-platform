import recommendationService from '../services/recommendation.service.js';

class RecommendationController {
  async getRecommendations(req, res) {
    try {
      const recommendations = await recommendationService.getRecommendations(req.user.id);
      res.json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async refreshRecommendations(req, res) {
    try {
      const recommendations = await recommendationService.generateRecommendations(req.user.id);
      res.json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await recommendationService.updateRecommendationStatus(req.user.id, id, status);
      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getHistory(req, res) {
    try {
      const history = await recommendationService.getHistory(req.user.id);
      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RecommendationController();
