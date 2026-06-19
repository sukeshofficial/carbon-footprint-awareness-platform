import { ENERGY_FACTORS } from '../../config/carbonEstimation.config.js';

/**
 * Estimates energy-related CO2 emissions.
 * Units: kg CO2 per month.
 */
export const estimateEnergy = (inputs) => {
  const {
    acUsage = 'none',
    fanUsage = 'none',
    householdSize = 1
  } = inputs;

  const acKWh = ENERGY_FACTORS.ac[acUsage] || 0;
  const fanKWh = ENERGY_FACTORS.fan[fanUsage] || 0;
  const baseKWh = ENERGY_FACTORS.householdBasePerPerson;

  const safeHouseholdSize = Math.max(1, householdSize || 1);
  const totalKWh = (acKWh + fanKWh + baseKWh);
  const perPersonCO2 = (totalKWh * ENERGY_FACTORS.gridIntensity) / safeHouseholdSize;

  return isNaN(perPersonCO2) ? 0 : perPersonCO2;
};
