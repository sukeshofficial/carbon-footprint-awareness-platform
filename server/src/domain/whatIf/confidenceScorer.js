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

// ── Per-category rule functions ─────────────────────────────────────────────

function scoreTransport(baselineInputs) {
  const hasTransport = !!baselineInputs.primaryMode && !!baselineInputs.weeklyCommuteDistance;
  let score = hasTransport ? 80 : 40;
  if (baselineInputs.weeklyCommuteDistance > 0) score = Math.min(score + 10, 90);
  return score;
}

function scoreFood(baselineInputs) {
  return baselineInputs.dietStyle ? 75 : 45;
}

function scoreEnergy(baselineInputs) {
  return baselineInputs.acUsage ? 70 : 40;
}

function scoreShopping(baselineInputs) {
  return baselineInputs.onlineShoppingFrequency ? 65 : 35;
}

// ── Template-to-scorer dispatch table ──────────────────────────────────────

const SCENARIO_SCORERS = {
  switch_to_metro: scoreTransport,
  switch_to_bus: scoreTransport,
  walk_or_bike: scoreTransport,
  vegetarian_days: scoreFood,
  reduce_ac_usage: scoreEnergy,
  reduce_online_orders: scoreShopping,
};

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * @param {object} baselineInputs   - The user's normalized baseline inputs
 * @param {string} templateId       - Scenario template ID
 * @param {object} latestEstimation - Latest persisted estimation document
 * @returns {number} Confidence score 0–100
 */
export function scoreConfidence(baselineInputs, templateId, latestEstimation) {
  const scorer = SCENARIO_SCORERS[templateId];
  let score = scorer ? scorer(baselineInputs) : 50;

  // Penalty if baseline estimation confidence was already low
  const baseConfidence = latestEstimation?.confidenceScore ?? 100;
  if (baseConfidence < 60) score = Math.max(score - 15, 20);

  return Math.min(100, Math.max(0, score));
}

