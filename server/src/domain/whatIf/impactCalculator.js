/**
 * impactCalculator.js
 * Computes the CO2 delta for a scenario by running the affected estimator
 * against the modified input snapshot (from scenarioApplier.js).
 *
 * Only the relevant category is re-run; unaffected categories use baseline values.
 * This keeps calculations consistent with the main estimation engine.
 */

import { TRANSPORT_CONVERSION_FACTORS } from '../../config/carbonEstimation.config.js';
import { estimateTransport } from '../carbonEstimation/transportEstimator.js';
import { estimateFood } from '../carbonEstimation/foodEstimator.js';
import { estimateEnergy } from '../carbonEstimation/energyEstimator.js';
import { estimateShopping } from '../carbonEstimation/shoppingEstimator.js';
import { DIET_FACTORS, ENERGY_FACTORS, SHOPPING_FACTORS } from '../../config/carbonEstimation.config.js';

/**
 * @param {object} baselineInputs   - Original normalized inputs
 * @param {object} modifiedInputs   - Scenario-applied modified inputs (from scenarioApplier)
 * @param {object} latestEstimation - User's latest saved estimation (for baseline totals)
 * @returns {{ baselineCO2, projectedCO2, co2Saved, monthlySavingsCO2, yearlySavingsCO2 }}
 */
export function calculateImpact(baselineInputs, modifiedInputs, latestEstimation) {
  const scenarioType = modifiedInputs._scenarioType;

  const baselineCO2 = latestEstimation?.totalMonthlyCO2 ?? 0;
  let projectedCO2 = baselineCO2;

  switch (scenarioType) {
    case 'transportSwitch': {
      const baselineTransport = estimateTransport(baselineInputs);
      const projectedTransport = calcWeightedTransport(modifiedInputs);
      projectedCO2 = baselineCO2 - baselineTransport + projectedTransport;
      break;
    }

    case 'walkOrBike': {
      const baselineTransport = estimateTransport(baselineInputs);
      const projectedTransport = estimateTransport(modifiedInputs);
      projectedCO2 = baselineCO2 - baselineTransport + projectedTransport;
      break;
    }

    case 'vegetarianDays': {
      const baselineFood = estimateFood(baselineInputs);
      const projectedFood = calcBlendedFoodCO2(modifiedInputs);
      projectedCO2 = baselineCO2 - baselineFood + projectedFood;
      break;
    }

    case 'reduceAC': {
      const baselineEnergy = estimateEnergy(baselineInputs);
      const kWhSaved = modifiedInputs._scenarioAcKWhSaved ?? 0;
      const co2ReducedFromAC = kWhSaved * ENERGY_FACTORS.gridIntensity;
      projectedCO2 = baselineCO2 - baselineEnergy + (baselineEnergy - co2ReducedFromAC);
      break;
    }

    case 'reduceOnlineShopping': {
      const baselineShopping = estimateShopping(baselineInputs);
      const reductionPct = modifiedInputs._scenarioShoppingReductionPct ?? 0;
      const projectedShopping = baselineShopping * (1 - reductionPct);
      projectedCO2 = baselineCO2 - baselineShopping + projectedShopping;
      break;
    }

    default:
      break;
  }

  projectedCO2 = Math.max(0, projectedCO2);
  const co2Saved = Math.max(0, baselineCO2 - projectedCO2);

  return {
    baselineCO2: parseFloat(baselineCO2.toFixed(2)),
    projectedCO2: parseFloat(projectedCO2.toFixed(2)),
    co2Saved: parseFloat(co2Saved.toFixed(2)),
    monthlySavingsCO2: parseFloat(co2Saved.toFixed(2)),
    yearlySavingsCO2: parseFloat((co2Saved * 12).toFixed(2)),
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Weighted transport CO2: fraction of commute on new mode, rest on old mode.
 */
function calcWeightedTransport(inputs) {
  const { _scenarioTransportFraction: f, _scenarioNewMode: newMode, _scenarioOldMode: oldMode, weeklyCommuteDistance: dist } = inputs;
  const safe = (mode) => TRANSPORT_CONVERSION_FACTORS[mode] ?? 0;
  const monthlyDist = (dist ?? 0) * 4.33;
  return monthlyDist * (f * safe(newMode) + (1 - f) * safe(oldMode));
}

/**
 * Blended food CO2: some days vegetarian, some days original diet.
 * Uses `dietType` key which matches the inputNormalizer output.
 */
function calcBlendedFoodCO2(inputs) {
  const vegDays = inputs._scenarioDiet_daysVeg ?? 0;
  const originalDietType = inputs._scenarioDiet_originalDietType ?? 'mixed_diet';
  const originalDailyKg = DIET_FACTORS[originalDietType] ?? DIET_FACTORS.mixed_diet;
  const vegetarianDailyKg = DIET_FACTORS.vegetarian;

  const DAYS_IN_MONTH = 30;
  const vegDaysInMonth = (vegDays / 7) * DAYS_IN_MONTH;
  const nonVegDaysInMonth = DAYS_IN_MONTH - vegDaysInMonth;

  return (vegDaysInMonth * vegetarianDailyKg) + (nonVegDaysInMonth * originalDailyKg);
}
