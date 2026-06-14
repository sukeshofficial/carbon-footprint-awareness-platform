import { ENERGY_FACTORS } from '../../config/carbonEstimation.config.js';

/**
 * Estimates energy-related CO2 emissions.
 * Units: kg CO2 per month.
 */
export const estimateEnergy = (inputs) => {
  const { acUsage, fanUsage, householdSize } = inputs;

  const acKWh = ENERGY_FACTORS.ac[acUsage] || 0;
  const fanKWh = ENERGY_FACTORS.fan[fanUsage] || 0;

  const baseKWhPerPerson = ENERGY_FACTORS.householdBasePerPerson;

  const totalHouseholdKWh = acKWh + fanKWh + (baseKWhPerPerson * (householdSize || 1));

  // Share among household members (simplified shared impact)
  const myKWhShare = householdSize > 1 ? totalHouseholdKWh / householdSize : totalHouseholdKWh;

  return myKWhShare * ENERGY_FACTORS.gridIntensity;
};
