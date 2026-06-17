import { test } from 'node:test';
import assert from 'node:assert';
import { estimateFood } from '../foodEstimator.js';

test('estimateFood returns higher CO2 for non_vegetarian diet', () => {
  const meatHeavy = estimateFood({ dietType: 'non_vegetarian' });
  const vegan = estimateFood({ dietType: 'vegan' });

  assert.ok(meatHeavy > vegan);
});

test('estimateFood returns a positive number', () => {
  const result = estimateFood({ dietType: 'mixed_diet' });
  assert.ok(result > 0);
});
