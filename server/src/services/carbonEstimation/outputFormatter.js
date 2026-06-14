/**
 * Shapes the final response for APIs and UI.
 * Provides a clean object for the frontend.
 */
export const formatEstimationResponse = (estimation) => {
  if (!estimation) return null;

  return {
    id: estimation._id,
    totalCO2: Math.round(estimation.totalMonthlyCO2),
    weeklyEstimate: Math.round(estimation.totalWeeklyCO2),
    monthlyEstimate: Math.round(estimation.totalMonthlyCO2),
    topSource: estimation.topSource,
    severityLevel: estimation.severityLevel,
    trendLabel: estimation.trendLabel,
    categoryBreakdown: {
      transport: Math.round(estimation.transportCO2),
      food: Math.round(estimation.foodCO2),
      energy: Math.round(estimation.energyCO2),
      shopping: Math.round(estimation.shoppingCO2),
    },
    confidenceScore: estimation.confidenceScore,
    calculatedAt: estimation.calculatedAt,
    aiInsights: estimation.aiInsights,
    explanation: estimation.aiInsights?.explanation || `Your largest carbon source is ${estimation.topSource}. Your footprint is considered ${estimation.severityLevel} based on regional averages.`,
  };
};
