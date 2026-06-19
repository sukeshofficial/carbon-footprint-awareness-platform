import recommendationRepository from '../infrastructure/repositories/recommendation.repository.js';
import recommendationFeedbackRepository from '../infrastructure/repositories/recommendationFeedback.repository.js';
import carbonEstimationRepository from '../infrastructure/repositories/carbonEstimation.repository.js';
import carbonContextRepository from '../infrastructure/repositories/carbonContext.repository.js';
import candidateGenerator from '../domain/recommendation/candidateGenerator.js';
import recommendationRanker from '../domain/recommendation/recommendationRanker.js';
import reasonBuilder from '../domain/recommendation/reasonBuilder.js';
import recommendationFormatter from '../domain/recommendation/recommendationFormatter.js';
import recommendationCache from '../domain/recommendation/recommendationCache.js';
import { recommendationFeedbackSchema } from '../shared/schemas/carbon.schemas.js';

class RecommendationService {
  async getRecommendations(userId, forceRefresh = false) {
    if (!forceRefresh) {
      const cached = recommendationCache.get(userId);
      if (cached) return cached;

      const active = await recommendationRepository.getActiveByUserId(userId);
      if (active.length > 0) {
        const estimation = await carbonEstimationRepository.getLatestByUserId(userId);
        const formatted = recommendationFormatter.format(active, estimation);
        recommendationCache.set(userId, formatted);
        return formatted;
      }
    }

    return await this.generateRecommendations(userId);
  }

  async generateRecommendations(userId) {
    const estimation = await carbonEstimationRepository.getLatestByUserId(userId);
    if (!estimation) {
      throw new Error('No carbon estimation found for user. Please complete onboarding first.');
    }

    const context = await carbonContextRepository.findByUserId(userId);
    if (!context) {
      throw new Error('No carbon context found for user.');
    }

    // 1. Generate Candidates
    const candidates = candidateGenerator.generateCandidates(context, estimation);

    // 2. Rank Candidates
    const ranked = recommendationRanker.scoreAndRank(candidates, estimation);

    // 3. Add Reasons & Format for Database
    const recommendationsToSave = ranked.map(rec => ({
      userId,
      recommendationKey: rec.key,
      category: rec.category,
      title: rec.title,
      description: rec.description,
      co2SavedEstimate: rec.co2SavedEstimate,
      moneySavedEstimate: rec.moneySavedEstimate,
      effortLevel: rec.effortLevel,
      impactScore: rec.impactScore,
      rankScore: rec.rankScore,
      confidenceScore: rec.confidenceScore,
      reasonText: reasonBuilder.buildReason(rec, estimation),
      status: 'active',
      generatedAt: new Date(),
    }));

    // 4. Persistence
    // Clear old active recommendations
    await recommendationRepository.deleteByUserId(userId);

    // Save new ones
    const saved = await recommendationRepository.saveMany(recommendationsToSave);

    // 5. Format for UI
    const formatted = recommendationFormatter.format(saved, estimation);

    // 6. Cache
    recommendationCache.set(userId, formatted);

    return formatted;
  }

  async updateRecommendationStatus(userId, id, status) {
    const validated = recommendationFeedbackSchema.parse({ status });
    const recommendation = await recommendationRepository.getById(id);
    if (!recommendation || recommendation.userId.toString() !== userId.toString()) {
      throw new Error('Recommendation not found or unauthorized');
    }

    const updated = await recommendationRepository.updateStatus(id, validated.status);

    // Log feedback
    await recommendationFeedbackRepository.logFeedback({
      userId,
      recommendationId: id,
      recommendationKey: recommendation.recommendationKey,
      status,
    });

    // Invalidate cache
    recommendationCache.invalidate(userId);

    return updated;
  }

  async getHistory(userId) {
    return await recommendationRepository.getHistoryByUserId(userId);
  }
}

export default new RecommendationService();
