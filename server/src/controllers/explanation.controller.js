import explanationService from '../services/explanation.service.js';

class ExplanationController {
  async getMyExplanation(req, res) {
    try {
      const userId = req.user.id;
      const explanation = await explanationService.getExplanationForUser(userId);

      if (!explanation) {
        return res.status(404).json({
          success: false,
          message: 'No carbon estimation found. Please complete the carbon assessment first.',
        });
      }

      return res.status(200).json({
        success: true,
        data: explanation,
      });
    } catch (error) {
      console.error('[ExplanationController] Error fetching explanation:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while generating explanations.',
      });
    }
  }
}

export default new ExplanationController();
