import { DIET_FACTORS } from '../../config/carbonEstimation.config.js';

/**
 * Estimates food-related CO2 emissions.
 * Units: kg CO2 per month.
 */
export const estimateFood = (inputs) => {
  const { dietType = 'mixed_diet' } = inputs;
  const dailyKg = DIET_FACTORS[dietType] || DIET_FACTORS.mixed_diet;
  const total = dailyKg * 30.4;
  return isNaN(total) ? 0 : total;
};
