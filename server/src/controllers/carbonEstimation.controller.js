import carbonEstimationService from '../services/carbonEstimation.service.js';
import { formatEstimationResponse } from '../domain/carbonEstimation/outputFormatter.js';
import aiService from '../services/ai.service.js';
import { carbonInputSchema } from '../../../shared/schemas/carbon.schemas.js';
import { getFallbackInsights } from '../domain/rules/fallbackEngine.js';

class CarbonEstimationController {
  async getMyEstimation(req, res) {
    try {
      const userId = req.user.id;
      const estimation = await carbonEstimationService.getLatestEstimation(userId);

      if (!estimation) {
        return res.status(404).json({
          status: 'error',
          message: 'No carbon estimation found. Please complete your profile and carbon context onboarding.',
        });
      }

      res.status(200).json({
        status: 'success',
        data: formatEstimationResponse(estimation),
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async recalculate(req, res) {
    try {
      const userId = req.user.id;
      const estimation = await carbonEstimationService.calculateForUser(userId);

      res.status(201).json({
        status: 'success',
        message: 'Carbon footprint recalculated successfully.',
        data: formatEstimationResponse(estimation),
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const history = await carbonEstimationService.getEstimationHistory(userId);

      res.status(200).json({
        status: 'success',
        data: history.map(formatEstimationResponse),
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getMyInsights(req, res) {
    try {
      const userId = req.user.id;
      const estimation = await carbonEstimationService.getLatestEstimation(userId);

      if (!estimation) {
        return res.status(404).json({ status: 'error', message: 'No estimation found' });
      }

      // If already has insights, return them
      if (estimation.aiInsights) {
        return res.status(200).json({ status: 'success', data: estimation.aiInsights });
      }

      // Generate on the fly if needed
      const insights = await aiService.generateCarbonInsights(estimation, estimation.inputSnapshotJson);

      if (insights) {
        await carbonEstimationService.updateEstimation(estimation._id, { aiInsights: insights });
      }

      res.status(200).json({
        status: 'success',
        data: insights || { explanation: 'Insights still generating...', tips: [] },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async streamMyInsights(req, res) {
    try {
      const userId = req.user.id;
      const estimation = await carbonEstimationService.getLatestEstimation(userId);

      if (!estimation) {
        res.status(404).json({ status: 'error', message: 'No estimation found' });
        return;
      }

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders();

      // If cached insights exist, serve immediately without calling AI
      if (estimation.aiInsights?.tips?.length > 0) {
        res.write(`data: ${JSON.stringify({ done: true, insights: estimation.aiInsights })}\n\n`);
        res.end();
        return;
      }

      // Stream new insights from AI
      await aiService.streamCarbonInsights(estimation, estimation.inputSnapshotJson, res);

    } catch (error) {
      console.error('[Controller] streamMyInsights error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ status: 'error', message: error.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  }
}

export default new CarbonEstimationController();
