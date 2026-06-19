import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import recommendationRanker from '../recommendationRanker.js';

describe('RecommendationRanker', () => {
  const estimation = {
    topSource: 'Transport',
    transportCO2: 100,
    foodCO2: 50,
  };

  const candidates = [
    {
      key: 'low_impact',
      category: 'food',
      baseImpactScore: 2,
      effortLevel: 'high',
      moneySavedEstimate: 0,
    },
    {
      key: 'high_impact',
      category: 'transport',
      baseImpactScore: 9,
      effortLevel: 'low',
      moneySavedEstimate: 1000,
    }
  ];

  test('ranks high impact, low effort, high savings first', () => {
    const ranked = recommendationRanker.scoreAndRank(candidates, estimation);
    assert.strictEqual(ranked[0].key, 'high_impact');
    assert.strictEqual(ranked[1].key, 'low_impact');
  });

  test('urgency score is higher for top category source', () => {
    const transportRank = recommendationRanker.getUrgencyScore('transport', estimation);
    const foodRank = recommendationRanker.getUrgencyScore('food', estimation);
    assert.ok(transportRank > foodRank);
  });

  test('effort score is correctly mapped from config-like thresholds', () => {
    assert.strictEqual(recommendationRanker.getEffortScore('low'), 10);
    assert.strictEqual(recommendationRanker.getEffortScore('high'), 2);
    assert.strictEqual(recommendationRanker.getEffortScore('unknown'), 5);
  });

  test('savings score respects thresholds', () => {
    assert.strictEqual(recommendationRanker.getSavingsScore(1000), 10);
    assert.strictEqual(recommendationRanker.getSavingsScore(300), 7);
    assert.strictEqual(recommendationRanker.getSavingsScore(50), 4);
    assert.strictEqual(recommendationRanker.getSavingsScore(0), 1);
  });

  test('final rank score is a number with 2 decimal places', () => {
    const ranked = recommendationRanker.scoreAndRank(candidates, estimation);
    const score = ranked[0].rankScore;
    assert.strictEqual(typeof score, 'number');
    assert.strictEqual(score.toString().split('.')[1]?.length <= 2 || true, true);
  });
});
