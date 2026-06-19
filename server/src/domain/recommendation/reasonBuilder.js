class ReasonBuilder {
  buildReason(recommendation, estimation) {
    const topCategory = estimation.topSource?.toLowerCase();

    if (recommendation.category === topCategory) {
      return `This was recommended because ${recommendation.category} emissions are your biggest source of carbon footprint.`;
    }

    if (recommendation.effortLevel === 'low' && recommendation.impactScore >= 5) {
      return `This is a strong first step because it gives good savings with low effort.`;
    }

    if (recommendation.moneySavedEstimate > 300) {
      return `This action helps you save significant money while also reducing your footprint.`;
    }

    return `This fits your current lifestyle and helps reduce your environmental impact incrementally.`;
  }
}

export default new ReasonBuilder();
