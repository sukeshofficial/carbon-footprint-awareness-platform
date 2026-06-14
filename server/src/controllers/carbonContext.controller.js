import carbonContextService from '../services/carbonContext.service.js';

class CarbonContextController {
  async getQuestions(req, res) {
    try {
      const config = carbonContextService.getQuestionnaireConfig();
      return res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMyResponses(req, res) {
    try {
      const userId = req.user.id;
      const responses = await carbonContextService.getCompletionProgress(userId);
      return res.status(200).json({
        success: true,
        data: responses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStep(req, res) {
    try {
      const userId = req.user.id;
      const { stepKey } = req.params;
      const stepData = req.body;

      const updatedContext = await carbonContextService.saveStepResponse(userId, stepKey, stepData);

      return res.status(200).json({
        success: true,
        data: updatedContext,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async skipStep(req, res) {
    try {
      const userId = req.user.id;
      const { stepKey } = req.params;

      const updatedContext = await carbonContextService.skipSection(userId, stepKey);

      return res.status(200).json({
        success: true,
        data: updatedContext,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async completeOnboarding(req, res) {
    try {
      const userId = req.user.id;
      const completedContext = await carbonContextService.completeOnboarding(userId);

      return res.status(200).json({
        success: true,
        data: completedContext,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CarbonContextController();
