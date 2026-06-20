/**
 * difficultyScorer.js
 * Assigns a rule-based difficulty level to a scenario.
 *
 * easy:   Small habit tweak, low friction, no planning required.
 * medium: Requires some planning or behavioral consistency.
 * hard:   Needs lifestyle disruption or significant commitment.
 */

import { SCENARIO_TEMPLATES } from '../../shared/constants/scenarioDefinitions.js';

/**
 * @param {string} templateId
 * @returns {'easy'|'medium'|'hard'}
 */
export function scoreDifficulty(templateId) {
  const template = SCENARIO_TEMPLATES.find((t) => t.id === templateId);

  if (template?.difficulty) return template.difficulty;

  const easy = [
    'reduce_ac_usage',
    'reduce_online_orders',
    'vegetarian_days',
  ];

  const medium = [
    'switch_to_metro',
    'switch_to_bus',
    'walk_or_bike',
  ];

  const hard = [
    'go_car_free',
    'install_solar'
  ];

  if (easy.includes(templateId)) return 'easy';
  if (medium.includes(templateId)) return 'medium';
  if (hard.includes(templateId)) return 'hard';

  return 'medium';
}

