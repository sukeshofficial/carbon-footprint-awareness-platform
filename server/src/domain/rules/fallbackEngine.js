/**
 * Rule-based fallback engine for carbon insights.
 * Provides deterministic, high-quality tips when AI is unavailable.
 */

export const getFallbackInsights = (estimationData, normalizedInputs) => {
  const { totalMonthlyCO2, topSource, transportCO2, foodCO2, energyCO2, shoppingCO2 } = estimationData;
  const tips = [];

  // 1. Analyze Transport
  if (topSource === 'Transport' || transportCO2 > totalMonthlyCO2 * 0.4) {
    if (normalizedInputs.primaryMode === 'car') {
      tips.push({
        title: 'Optimize Commutes',
        description: 'Transitioning to public transport or carpooling even 2 days a week can cut your transport footprint by 30%.'
      });
    } else {
      tips.push({
        title: 'Reduce Flight Frequency',
        description: 'Consider rail for domestic travel. One long-haul flight can exceed your entire annual carbon budget.'
      });
    }
  }

  // 2. Analyze Food/Diet
  if (topSource === 'Food' || foodCO2 > totalMonthlyCO2 * 0.3) {
    if (normalizedInputs.dietType === 'meat-heavy' || normalizedInputs.dietType === 'balanced') {
      tips.push({
        title: 'Plant-Forward Days',
        description: 'Adopt "Meatless Mondays". Reducing beef and lamb consumption is the single most effective dietary change for the planet.'
      });
    } else {
      tips.push({
        title: 'Minimize Food Waste',
        description: 'Plan meals ahead to reduce waste. Rotting food in landfills is a major source of methane emissions.'
      });
    }
  }

  // 3. Analyze Energy
  if (topSource === 'Energy' || energyCO2 > totalMonthlyCO2 * 0.3) {
    tips.push({
      title: 'Energy Efficiency',
      description: 'Switch to LED bulbs and adjust your thermostat by just 1 degree to see immediate energy and cost savings.'
    });
  }

  // 4. Analyze Consumption
  if (topSource === 'Shopping' || shoppingCO2 > totalMonthlyCO2 * 0.2) {
    tips.push({
      title: 'Mindful Consumption',
      description: 'Choose quality over quantity. Small changes in shopping habits significantly reduce manufacturing and shipping emissions.'
    });
  }

  // Ensure we always have exactly 3 tips
  const genericTips = [
    {
      title: 'Track Regularly',
      description: 'Consistent monitoring is the first step toward meaningful reduction. Keep using Carbon Coach to see your progress.'
    },
    {
      title: 'Community Action',
      description: 'Share your sustainability goals with friends to multiply your positive impact through collective action.'
    }
  ];

  while (tips.length < 3) {
    const nextGeneric = genericTips.find(gt => !tips.some(t => t.title === gt.title));
    if (nextGeneric) tips.push(nextGeneric);
    else break;
  }

  return {
    explanation: `Based on your ${topSource.toLowerCase()} usage, your monthly footprint is ${totalMonthlyCO2.toFixed(1)}kg CO2e.`,
    tips: tips.slice(0, 3),
    encouragement: "Small, consistent changes lead to a massive collective impact. You've got this!",
    source: 'rules'
  };
};
