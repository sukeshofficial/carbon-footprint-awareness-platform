import carbonEstimationService from './carbonEstimation.service.js';
import explanationRepository from '../infrastructure/repositories/explanation.repository.js';
import { summaryRules, categoryRules, habitRules, recommendationRules } from './explanation.rules.js';
import { summaryTemplates, categoryTemplates, habitTemplates, recommendationTemplates } from './explanation.templates.js';
import { mapToExplanationSignals } from './explanation.mapper.js';

class ExplanationService {
  async getExplanationForUser(userId) {
    // 1. Check for cached version first (optional, but good for speed)
    // For now, we'll re-generate if needed, or always generate and save.

    const latestEstimation = await carbonEstimationService.getLatestEstimation(userId);
    if (!latestEstimation) {
      return null;
    }

    // Check if we already have an explanation for this estimation
    const existing = await explanationRepository.getByEstimationId(latestEstimation._id);
    if (existing) {
      return this._formatResponse(existing);
    }

    const normalizedInputs = latestEstimation.inputSnapshotJson;
    const { signals, inputs } = mapToExplanationSignals(latestEstimation, normalizedInputs);

    const summary = this._generateSummary(signals);
    const category_explanations = this._generateCategoryExplanations(inputs);
    const habit_explanations = this._generateHabitExplanations(inputs);
    const recommendation_reasoning = this._generateRecommendationReasoning(inputs, signals);

    const explanationData = {
      userId,
      estimationId: latestEstimation._id,
      summaryText: summary,
      categoryExplanationsJson: category_explanations,
      habitExplanationsJson: habit_explanations,
      recommendationReasoningJson: recommendation_reasoning,
      version: '1.0.0', // Should match some config or versioning strategy
    };

    const saved = await explanationRepository.save(explanationData);
    return this._formatResponse(saved);
  }

  _formatResponse(data) {
    return {
      summary: data.summaryText,
      category_explanations: data.categoryExplanationsJson,
      habit_explanations: data.habitExplanationsJson,
      recommendation_reasoning: data.recommendationReasoningJson,
      confidence: 0.9,
      source_signals: {
        // These can be derived from the explanation or stored if needed
        // For MVP, we just return the saved data
      },
    };
  }

  _generateSummary(signals) {
    const rule = summaryRules.find(r => r.condition(signals));
    return rule ? summaryTemplates[rule.id] : summaryTemplates.balanced;
  }

  _generateCategoryExplanations(inputs) {
    const categories = ['transport', 'food', 'energy', 'shopping'];
    return categories.map(cat => {
      const rules = categoryRules[cat] || [];
      const rule = rules.find(r => r.condition(inputs));
      return {
        category: cat,
        reason: rule ? categoryTemplates[cat][rule.id] : categoryTemplates[cat].moderate || categoryTemplates[cat].mixed || "Your impact in this category is within the normal range.",
      };
    });
  }

  _generateHabitExplanations(inputs) {
    const matchedRules = habitRules.filter(r => r.condition(inputs));
    return matchedRules.map(r => ({
      habit: r.id.replace(/_/g, ' '),
      reason: habitTemplates[r.id],
    }));
  }

  _generateRecommendationReasoning(inputs, signals) {
    const matchedRules = recommendationRules.filter(r => r.condition(inputs, signals));
    return matchedRules.map(r => ({
      recommendation_id: r.id,
      reason: recommendationTemplates[r.id],
    }));
  }
}

export default new ExplanationService();
