/**
 * scenarioApplier.js
 * Applies a what-if scenario change to a deep-cloned snapshot of the user's
 * normalized baseline inputs. The clone is then passed to the impact calculator.
 * This module NEVER mutates the original baseline data.
 */

/**
 * Deep-clone baseline inputs and apply scenario-specific overrides.
 * @param {object} baseline - Normalized input object from inputNormalizer.js
 * @param {string} templateId - The scenario template identifier
 * @param {object} inputPayload - User-supplied scenario parameters (e.g., { daysPerWeek: 5 })
 * @returns {object} Modified clone of baseline inputs
 */
export function applyScenario(baseline, templateId, inputPayload) {
  const modified = JSON.parse(JSON.stringify(baseline)); // Deep clone

  switch (templateId) {
    case 'switch_to_metro':
      return applyTransportSwitch(modified, 'metro', inputPayload.daysPerWeek ?? 5);

    case 'switch_to_bus':
      return applyTransportSwitch(modified, 'bus', inputPayload.daysPerWeek ?? 5);

    case 'walk_or_bike':
      return applyWalkOrBike(modified, inputPayload.kmsPerDay ?? 5);

    case 'vegetarian_days':
      return applyVegetarianDays(modified, inputPayload.daysPerWeek ?? 3);

    case 'reduce_ac_usage':
      return applyReduceAC(modified, inputPayload.hoursReduced ?? 1);

    case 'reduce_online_orders':
      return applyReduceOnlineOrders(modified, inputPayload.reductionPercentage ?? 50);

    default:
      throw new Error(`Unknown scenario template: ${templateId}`);
  }
}

// ---------------------------------------------------------------------------
// Transport helpers
// ---------------------------------------------------------------------------

/**
 * Switches a fraction of weeklyCommuteDistance to a cleaner transport mode.
 * Days-based weighting: (newDays/7 of distance uses newMode, rest uses old primaryMode)
 */
function applyTransportSwitch(inputs, newMode, daysPerWeek) {
  const fraction = Math.min(daysPerWeek / 7, 1);
  // Store original values for the engine
  inputs._scenarioTransportFraction = fraction;
  inputs._scenarioNewMode = newMode;
  inputs._scenarioOldMode = inputs.primaryMode;
  // Flag picked up by impactCalculator to use weighted calculation
  inputs._scenarioType = 'transportSwitch';
  return inputs;
}

function applyWalkOrBike(inputs, kmsPerDay) {
  // Reduce weekly commute distance by kmsPerDay * 7, but not below 0
  const reduction = kmsPerDay * 7;
  inputs.weeklyCommuteDistance = Math.max(0, (inputs.weeklyCommuteDistance ?? 0) - reduction);
  inputs._scenarioType = 'walkOrBike';
  return inputs;
}

// ---------------------------------------------------------------------------
// Food helpers
// ---------------------------------------------------------------------------

function applyVegetarianDays(inputs, daysPerWeek) {
  inputs._scenarioDiet_daysVeg = daysPerWeek;
  inputs._scenarioDiet_originalDietType = inputs.dietType;
  inputs._scenarioType = 'vegetarianDays';
  return inputs;
}

// ---------------------------------------------------------------------------
// Energy helpers
// ---------------------------------------------------------------------------

/**
 * Reduces monthly kWh for AC by estimating savings from hoursReduced/day.
 * AC power: ~1.5 kW (typical 1-ton unit), 30 days/month.
 */
function applyReduceAC(inputs, hoursReduced) {
  const AC_POWER_KW = 1.5;
  const monthlyKWhSaved = hoursReduced * AC_POWER_KW * 30;
  inputs._scenarioAcKWhSaved = monthlyKWhSaved;
  inputs._scenarioType = 'reduceAC';
  return inputs;
}

// ---------------------------------------------------------------------------
// Shopping helpers
// ---------------------------------------------------------------------------

function applyReduceOnlineOrders(inputs, reductionPercentage) {
  inputs._scenarioShoppingReductionPct = reductionPercentage / 100;
  inputs._scenarioType = 'reduceOnlineShopping';
  return inputs;
}
