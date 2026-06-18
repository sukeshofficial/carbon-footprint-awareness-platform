class RecommendationRanker {
  constructor() {
    this.weights = {
      impact: 0.4,
      effort: 0.2, // Inverse weight (higher effort = lower score)
      savings: 0.2,
      urgency: 0.2,
    };
  }

  scoreAndRank(candidates, estimation) {
    const scoredCandidates = candidates.map(candidate => {
      const impactScore = candidate.baseImpactScore;
      const effortScore = this.getEffortScore(candidate.effortLevel);
      const savingsScore = this.getSavingsScore(candidate.moneySavedEstimate);
      const urgencyScore = this.getUrgencyScore(candidate.category, estimation);

      const rankScore = (
        (impactScore * this.weights.impact) +
        (effortScore * this.weights.effort) +
        (savingsScore * this.weights.savings) +
        (urgencyScore * this.weights.urgency)
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
    switch (effortLevel) {
      case 'low': return 10;
      case 'medium': return 6;
      case 'high': return 2;
      default: return 5;
    }
  }

  getSavingsScore(savings) {
    if (savings > 500) return 10;
    if (savings > 200) return 7;
    if (savings > 0) return 4;
    return 1;
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
