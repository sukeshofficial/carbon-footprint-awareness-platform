class RecommendationFormatter {
  format(rankedRecommendations, estimation) {
    const topActions = rankedRecommendations.slice(0, 3).map(rec => ({
      ...rec,
      isTopPriority: true
    }));

    const categorySuggestions = {
      transport: rankedRecommendations.filter(r => r.category === 'transport'),
      food: rankedRecommendations.filter(r => r.category === 'food'),
      energy: rankedRecommendations.filter(r => r.category === 'energy'),
      shopping: rankedRecommendations.filter(r => r.category === 'shopping'),
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
