/**
 * whatIfScenario.service.js
 * Orchestrates the what-if scenario preview and save flows.
 *
 * Preview flow: validate → load baseline → apply scenario → calculate → return (no persist)
 * Save flow:    validate → preview → persist scenario + result → return
 */

import carbonEstimationRepository from '../infrastructure/repositories/carbonEstimation.repository.js';
import profileRepository from '../infrastructure/repositories/profile.repository.js';
import CarbonContext from '../infrastructure/models/carbonContext.model.js';
import whatIfScenarioRepository from '../infrastructure/repositories/whatIfScenario.repository.js';

import { SCENARIO_TEMPLATES } from '../../../shared/constants/scenarioDefinitions.js';
import { normalizeInputs } from '../domain/carbonEstimation/inputNormalizer.js';
import { applyScenario } from '../domain/whatIf/scenarioApplier.js';
import { calculateImpact } from '../domain/whatIf/impactCalculator.js';
import { estimateMoneySavings } from '../domain/whatIf/savingsEstimator.js';
import { scoreConfidence } from '../domain/whatIf/confidenceScorer.js';
import { scoreDifficulty } from '../domain/whatIf/difficultyScorer.js';

import {
  scenarioInputSchema,
  switchToTransportSchema,
  walkOrBikeSchema,
  vegetarianDaysSchema,
  reduceAcSchema,
  reduceOnlineOrdersSchema,
} from '../../../shared/schemas/carbon.schemas.js';

const PAYLOAD_SCHEMAS = {
  switch_to_metro: switchToTransportSchema,
  switch_to_bus: switchToTransportSchema,
  walk_or_bike: walkOrBikeSchema,
  vegetarian_days: vegetarianDaysSchema,
  reduce_ac_usage: reduceAcSchema,
  reduce_online_orders: reduceOnlineOrdersSchema,
};

class WhatIfScenarioService {
  /**
   * Returns all available scenario templates (no user-specific data).
   */
  getScenarioTemplates() {
    return SCENARIO_TEMPLATES;
  }

  /**
   * Preview a scenario without persisting anything.
   * @param {string} userId
   * @param {string} templateId
   * @param {object} inputPayload - User-configured inputs (e.g., { daysPerWeek: 4 })
   */
  async previewScenario(userId, templateId, inputPayload) {
    // 1. Basic validation
    scenarioInputSchema.parse({ templateId, inputPayload });

    const template = SCENARIO_TEMPLATES.find((t) => t.id === templateId);
    if (!template) throw new Error(`Unknown scenario template: ${templateId}`);

    // 2. Scenario-specific payload validation
    const payloadValidator = PAYLOAD_SCHEMAS[templateId];
    const validatedPayload = payloadValidator ? payloadValidator.parse(inputPayload) : inputPayload;

    // Load baseline data
    const profile = await profileRepository.getProfileByUserId(userId);
    const carbonContext = await CarbonContext.findOne({ userId });
    const latestEstimation = await carbonEstimationRepository.getLatestByUserId(userId);

    if (!latestEstimation) {
      throw new Error('No carbon estimation found. Please calculate your footprint first.');
    }

    const baselineInputs = normalizeInputs(profile, carbonContext);
    const modifiedInputs = applyScenario(baselineInputs, templateId, validatedPayload);
    const impact = calculateImpact(baselineInputs, modifiedInputs, latestEstimation);
    const moneySavings = estimateMoneySavings(templateId, modifiedInputs, validatedPayload);
    const confidence = scoreConfidence(baselineInputs, templateId, latestEstimation);
    const difficulty = scoreDifficulty(templateId);

    const explanation = this._buildExplanationText(template, impact);

    return {
      templateId,
      title: template.title,
      scenarioType: template.type,
      ...impact,
      moneySavingsEstimate: moneySavings,
      difficultyLevel: difficulty,
      confidenceScore: confidence,
      explanationText: explanation,
      comparisonSummary: `By ${template.title.toLowerCase()}, you could reduce your monthly footprint from ${impact.baselineCO2} kg to ${impact.projectedCO2} kg CO₂.`,
    };
  }

  /**
   * Save a scenario and its results for a user.
   */
  async saveScenario(userId, templateId, inputPayload) {
    const template = SCENARIO_TEMPLATES.find((t) => t.id === templateId);
    if (!template) throw new Error(`Unknown scenario template: ${templateId}`);

    // Run the preview to get the result
    const previewResult = await this.previewScenario(userId, templateId, inputPayload);

    // Persist the scenario
    const scenario = await whatIfScenarioRepository.createScenario({
      userId,
      templateId,
      scenarioType: template.type,
      title: template.title,
      inputPayload,
      isSaved: true,
    });

    // Persist the result
    await whatIfScenarioRepository.createResult({
      scenarioId: scenario._id,
      userId,
      baselineCO2: previewResult.baselineCO2,
      projectedCO2: previewResult.projectedCO2,
      co2Saved: previewResult.co2Saved,
      monthlySavingsCO2: previewResult.monthlySavingsCO2,
      yearlySavingsCO2: previewResult.yearlySavingsCO2,
      moneySavingsEstimate: previewResult.moneySavingsEstimate,
      difficultyLevel: previewResult.difficultyLevel,
      confidenceScore: previewResult.confidenceScore,
      explanationText: previewResult.explanationText,
    });

    return { ...previewResult, scenarioId: scenario._id };
  }

  /**
   * Get all saved scenarios for a user.
   */
  async getUserScenarios(userId) {
    const scenarios = await whatIfScenarioRepository.getScenariosByUserId(userId);

    const withResults = await Promise.all(
      scenarios.map(async (sc) => {
        const result = await whatIfScenarioRepository.getResultByScenarioId(sc._id);
        return { ...sc, result: result || null };
      })
    );

    return withResults;
  }

  /**
   * Get a single scenario by ID for a user.
   */
  async getScenarioById(userId, scenarioId) {
    const scenario = await whatIfScenarioRepository.getScenarioById(scenarioId, userId);
    if (!scenario) throw new Error('Scenario not found or unauthorized.');
    const result = await whatIfScenarioRepository.getResultByScenarioId(scenarioId);
    return { ...scenario.toObject(), result: result || null };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  _buildExplanationText(template, impact) {
    const saved = impact.co2Saved.toFixed(1);
    const yearly = impact.yearlySavingsCO2.toFixed(0);
    if (impact.co2Saved <= 0) {
      return `This change would have a minimal or no impact on your footprint based on current data.`;
    }
    return `${template.title} could save approximately ${saved} kg CO₂/month — that's ${yearly} kg per year saved from the atmosphere.`;
  }
}

export default new WhatIfScenarioService();
