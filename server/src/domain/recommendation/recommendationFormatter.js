class RecommendationFormatter {
  format(rankedRecommendations, estimation) {
    const plainRecommendations = rankedRecommendations.map(rec =>
      typeof rec.toObject === 'function' ? rec.toObject() : rec
    );

    const topActions = plainRecommendations.slice(0, 3).map(rec => ({
      ...rec,
      isTopPriority: true
    }));

    const categorySuggestions = {
      transport: plainRecommendations.filter(r => r.category === 'transport'),
      food: plainRecommendations.filter(r => r.category === 'food'),
      energy: plainRecommendations.filter(r => r.category === 'energy'),
      shopping: plainRecommendations.filter(r => r.category === 'shopping'),
    };

    const summary = {
      topCategory: estimation.topSource,
      bestEasyWin: rankedRecommendations.find(r => r.effortLevel === 'low'),
      bestHighImpactAction: rankedRecommendations.sort((a, b) => b.impactScore - a.impactScore)[0],
    };

    return {
      topActions,
      categorySuggestions,
      summary,
    };
  }
}

export default new RecommendationFormatter();
