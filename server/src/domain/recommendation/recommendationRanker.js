import { RECOMMENDATION_WEIGHTS, RANKING_THRESHOLDS } from '../../config/carbonEstimation.config.js';

class RecommendationRanker {
  scoreAndRank(candidates, estimation) {
    const scoredCandidates = candidates.map(candidate => {
      const impactScore = candidate.baseImpactScore;
      const effortScore = this.getEffortScore(candidate.effortLevel);
      const savingsScore = this.getSavingsScore(candidate.moneySavedEstimate);
      const urgencyScore = this.getUrgencyScore(candidate.category, estimation);

      const rankScore = (
        (impactScore * RECOMMENDATION_WEIGHTS.impact) +
        (effortScore * RECOMMENDATION_WEIGHTS.effort) +
        (savingsScore * RECOMMENDATION_WEIGHTS.savings) +
        (urgencyScore * RECOMMENDATION_WEIGHTS.urgency)
      );

      return {
        ...candidate,
        impactScore,
        rankScore: parseFloat(rankScore.toFixed(2)),
        confidenceScore: 90, // Default for now
      };
    });

    // Sort by rank score descending
    return scoredCandidates.sort((a, b) => b.rankScore - a.rankScore);
  }

  getEffortScore(effortLevel) {
    return RANKING_THRESHOLDS.effort[effortLevel] || RANKING_THRESHOLDS.effort.default;
  }

  getSavingsScore(savings) {
    if (savings > 500) return RANKING_THRESHOLDS.savings.high;
    if (savings > 200) return RANKING_THRESHOLDS.savings.medium;
    if (savings > 0) return RANKING_THRESHOLDS.savings.low;
    return RANKING_THRESHOLDS.savings.none;
  }

  getUrgencyScore(category, estimation) {
    const topCategory = estimation.topSource?.toLowerCase();
    if (category === topCategory) return 10;

    // Check if category emission is significant
    const categoryEmission = estimation[`${category}CO2`] || 0;
    if (categoryEmission > 20) return 8;
    if (categoryEmission > 10) return 5;

    return 2;
  }
}

export default new RecommendationRanker();
