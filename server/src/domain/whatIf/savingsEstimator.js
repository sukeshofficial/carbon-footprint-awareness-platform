/**
 * savingsEstimator.js
 * Estimates approximate ₹ savings for applicable scenarios.
 * Returns 0 for scenarios where monetary savings cannot be reasonably estimated.
 *
 * All values are labelled as estimates and are directional only.
 */

import { SAVINGS_MULTIPLIERS } from '../../shared/constants/scenarioDefinitions.js';

/**
 * @param {string} templateId     - Scenario template ID
 * @param {object} modifiedInputs - Scenario-applied inputs from scenarioApplier
 * @param {object} inputPayload   - Raw user input (e.g., { daysPerWeek: 5 })
 * @returns {number} Estimated monthly ₹ savings
 */
export function estimateMoneySavings(templateId, modifiedInputs, inputPayload) {
  switch (templateId) {
    case 'switch_to_metro':
    case 'switch_to_bus': {
      const oldMode = modifiedInputs._scenarioOldMode ?? 'car';
      const fraction = modifiedInputs._scenarioTransportFraction ?? 0;
      const weeklyDist = modifiedInputs.weeklyCommuteDistance ?? 0;
      const monthlyDist = weeklyDist * 4.33;
      const modesWithSavings = {
        car: SAVINGS_MULTIPLIERS.transport.car_to_metro,
        bike: SAVINGS_MULTIPLIERS.transport.bike_to_metro,
        cab: SAVINGS_MULTIPLIERS.transport.cab_to_metro,
      };
      const ratePerKm = modesWithSavings[oldMode] ?? 2.0;
      return parseFloat((monthlyDist * fraction * ratePerKm).toFixed(2));
    }

    case 'reduce_ac_usage': {
      const hoursReduced = inputPayload.hoursReduced ?? 1;
      const dailySavings = hoursReduced * SAVINGS_MULTIPLIERS.energy.ac_per_hour;
      return parseFloat((dailySavings * 30).toFixed(2));
    }

    case 'vegetarian_days': {
      const daysPerWeek = inputPayload.daysPerWeek ?? 3;
      const mealsPerDay = 2; // Lunch + Dinner as primary contributors
      const daysInMonth = (daysPerWeek / 7) * 30;
      return parseFloat((daysInMonth * mealsPerDay * SAVINGS_MULTIPLIERS.food.meat_to_veg_per_meal).toFixed(2));
    }

    case 'walk_or_bike':
    case 'reduce_online_orders':
    default:
      return 0;
  }
}
