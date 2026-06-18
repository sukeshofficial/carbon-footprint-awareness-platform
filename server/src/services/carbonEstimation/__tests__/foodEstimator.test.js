import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { estimateFood } from '../foodEstimator.js';
import { DIET_FACTORS } from '../../../config/carbonEstimation.config.js';

describe('estimateFood', () => {
  // ─── Happy paths ───────────────────────────────────────────────────────────

  test('vegetarian diet returns expected monthly value', () => {
    const expected = DIET_FACTORS.vegetarian * 30.4;
    const result = estimateFood({ dietType: 'vegetarian' });
    assert.ok(Math.abs(result - expected) < 0.01, `Expected ~${expected.toFixed(2)}, got ${result.toFixed(2)}`);
  });

  test('non_vegetarian produces highest CO2 of all diet types', () => {
    const nonVeg = estimateFood({ dietType: 'non_vegetarian' });
    const mixed = estimateFood({ dietType: 'mixed_diet' });
    const egg = estimateFood({ dietType: 'eggetarian' });
    const veg = estimateFood({ dietType: 'vegetarian' });
    assert.ok(nonVeg > mixed && mixed > egg && egg > veg, 'Diet ordering should be non_veg > mixed > egg > veg');
  });

  test('vegetarian is lower than non-vegetarian', () => {
    assert.ok(estimateFood({ dietType: 'vegetarian' }) < estimateFood({ dietType: 'non_vegetarian' }));
  });

  test('result is always positive', () => {
    for (const diet of ['vegetarian', 'eggetarian', 'mixed_diet', 'non_vegetarian']) {
      assert.ok(estimateFood({ dietType: diet }) > 0, `${diet} should return positive CO2`);
    }
  });

  // ─── Edge cases ────────────────────────────────────────────────────────────

  test('unknown diet type falls back to mixed_diet factor', () => {
    const fallback = estimateFood({ dietType: 'raw_carnivore' });
    const expected = DIET_FACTORS.mixed_diet * 30.4;
    assert.ok(Math.abs(fallback - expected) < 0.01, 'Unknown diets should fall back to mixed_diet');
  });

  test('undefined dietType does not throw and returns a positive number', () => {
    const result = estimateFood({ dietType: undefined });
    assert.ok(result > 0);
  });
});
