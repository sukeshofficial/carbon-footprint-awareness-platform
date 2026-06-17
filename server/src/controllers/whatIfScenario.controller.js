/**
 * whatIfScenario.controller.js
 * Handles What-If Scenario API requests.
 */

import whatIfScenarioService from '../services/whatIfScenario.service.js';

class WhatIfScenarioController {
  /** GET /api/v1/what-if/scenarios — list all available templates */
  getTemplates(req, res) {
    try {
      const templates = whatIfScenarioService.getScenarioTemplates();
      res.status(200).json({ status: 'success', data: templates });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /** POST /api/v1/what-if/scenarios/preview — preview without saving */
  async previewScenario(req, res) {
    try {
      const userId = req.user.id;
      const { templateId, inputPayload } = req.body;

      if (!templateId) {
        return res.status(400).json({ status: 'error', message: 'templateId is required.' });
      }

      const result = await whatIfScenarioService.previewScenario(userId, templateId, inputPayload || {});
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  /** POST /api/v1/what-if/scenarios — save a scenario */
  async saveScenario(req, res) {
    try {
      const userId = req.user.id;
      const { templateId, inputPayload } = req.body;

      if (!templateId) {
        return res.status(400).json({ status: 'error', message: 'templateId is required.' });
      }

      const result = await whatIfScenarioService.saveScenario(userId, templateId, inputPayload || {});
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  /** GET /api/v1/what-if/scenarios/me — list user's saved scenarios */
  async getMyScenarios(req, res) {
    try {
      const userId = req.user.id;
      const scenarios = await whatIfScenarioService.getUserScenarios(userId);
      res.status(200).json({ status: 'success', data: scenarios });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /** GET /api/v1/what-if/scenarios/:id — get a single saved scenario */
  async getScenarioById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const scenario = await whatIfScenarioService.getScenarioById(userId, id);
      res.status(200).json({ status: 'success', data: scenario });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }
}

export default new WhatIfScenarioController();
