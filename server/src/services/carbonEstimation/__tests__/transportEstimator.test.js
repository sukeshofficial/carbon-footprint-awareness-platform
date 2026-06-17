import { test } from 'node:test';
import assert from 'node:assert';
import { estimateTransport } from '../transportEstimator.js';

test('estimateTransport returns correct CO2 for primary mode only', () => {
  const inputs = {
    primaryMode: 'car',
    secondaryMode: null,
    weeklyCommuteDistance: 100,
    yearlyFlightFrequency: 0
  };

  const result = estimateTransport(inputs);
  assert.ok(result > 0);
});

test('estimateTransport includes flight impact', () => {
  const inputs = {
    primaryMode: 'walking',
    secondaryMode: null,
    weeklyCommuteDistance: 0,
    yearlyFlightFrequency: 1
  };

  const result = estimateTransport(inputs);
  assert.ok(result > 0);
});
