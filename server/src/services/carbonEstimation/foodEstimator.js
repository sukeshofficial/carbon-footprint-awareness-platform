import { DIET_FACTORS } from '../../config/carbonEstimation.config.js';

/**
 * Estimates food-related CO2 emissions.
 * Units: kg CO2 per month.
 */
export const estimateFood = (inputs) => {
  const { dietType } = inputs;

  // Daily factor
  const dailyCO2 = DIET_FACTORS[dietType] || DIET_FACTORS.mixed_diet;

  // Monthly (30.4 days avg)
  return dailyCO2 * 30.4;
};
