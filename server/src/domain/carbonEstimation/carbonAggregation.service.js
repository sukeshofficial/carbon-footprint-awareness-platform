import { SEVERITY_THRESHOLDS } from '../../config/carbonEstimation.config.js';

/**
 * Aggregates category CO2 values and derives high-level metrics.
 * @param {Object} results - { transport, food, energy, shopping } in kg CO2/month
 * @param {Object} previousEstimation - Previous CarbonEstimation document
 * @returns {Object} Aggregated data
 */
export const aggregateResults = (results, previousEstimation) => {
  const { transport, food, energy, shopping } = results;

  const totalMonthlyCO2 = transport + food + energy + shopping;
  const totalWeeklyCO2 = totalMonthlyCO2 / 4.33;

  // Determine top source
  const categories = [
    { name: 'Transport', value: transport },
    { name: 'Food', value: food },
    { name: 'Energy', value: energy },
    { name: 'Shopping', value: shopping },
  ];
  const topSource = categories.reduce(
    (prev, current) => (prev.value > current.value ? prev : current),
    { name: "", value: -Infinity }
  ).name;
  
  // Severity Level
  let severityLevel = 'high';
  if (totalMonthlyCO2 <= SEVERITY_THRESHOLDS.low) {
    severityLevel = 'low';
  } else if (totalMonthlyCO2 <= SEVERITY_THRESHOLDS.medium) {
    severityLevel = 'medium';
  }

  // Trend Label
  let trendLabel = 'new';
  if (previousEstimation) {
    const prevTotal = previousEstimation.totalMonthlyCO2;
    const diff = totalMonthlyCO2 - prevTotal;
    const percentChange = (diff / prevTotal) * 100;

    if (Math.abs(percentChange) < 2) {
      trendLabel = 'stable';
    } else if (percentChange < 0) {
      trendLabel = 'improved';
    } else {
      trendLabel = 'increased';
    }
  }

  return {
    transportCO2: transport,
    foodCO2: food,
    energyCO2: energy,
    shoppingCO2: shopping,
    totalMonthlyCO2,
    totalWeeklyCO2,
    topSource,
    severityLevel,
    trendLabel,
  };
};
