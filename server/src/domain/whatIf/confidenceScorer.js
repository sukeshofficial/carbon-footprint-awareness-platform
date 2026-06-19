/**
 * confidenceScorer.js
 * Assigns a confidence score (0–100) to a scenario result.
 *
 * High confidence when:
 *   - The user's baseline data for the affected category is complete and detailed.
 *
 * Low confidence when:
 *   - Onboarding is incomplete.
 *   - Scenario is compound or depends on many assumptions.
 */

/**
 * @param {object} baselineInputs   - The user's normalized baseline inputs
 * @param {string} templateId       - Scenario template ID
 * @param {object} latestEstimation - Latest persisted estimation document
 * @returns {number} Confidence score 0–100
 */
export function scoreConfidence(baselineInputs, templateId, latestEstimation) {
  let score = 50; // Start at medium

  const hasTransport = !!baselineInputs.primaryMode && !!baselineInputs.weeklyCommuteDistance;
  const hasFood = !!baselineInputs.dietStyle;
  const hasEnergy = !!baselineInputs.acUsage;
  const hasShopping = !!baselineInputs.onlineShoppingFrequency;

  const transportScenarios = ['switch_to_metro', 'switch_to_bus', 'walk_or_bike'];
  const foodScenarios = ['vegetarian_days'];
  const energyScenarios = ['reduce_ac_usage'];
  const shoppingScenarios = ['reduce_online_orders'];

  if (transportScenarios.includes(templateId)) {
    score = hasTransport ? 80 : 40;
    // Bonus if commute distance is precise
    if (baselineInputs.weeklyCommuteDistance > 0) score = Math.min(score + 10, 90);
  } else if (foodScenarios.includes(templateId)) {
    score = hasFood ? 75 : 45;
  } else if (energyScenarios.includes(templateId)) {
    score = hasEnergy ? 70 : 40;
  } else if (shoppingScenarios.includes(templateId)) {
    score = hasShopping ? 65 : 35;
  }

  // Penalty if baseline estimation confidence was already low
  const baseConfidence = latestEstimation?.confidenceScore ?? 100;
  if (baseConfidence < 60) score = Math.max(score - 15, 20);

  return Math.min(100, Math.max(0, score));
}
