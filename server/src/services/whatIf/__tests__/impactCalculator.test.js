import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateImpact } from '../impactCalculator.js';

describe('calculateImpact', () => {
  const latestEstimation = { totalMonthlyCO2: 500 };
  const baselineInputs = {
    primaryMode: 'car',
    weeklyCommuteDistance: 100,
    dietType: 'non_vegetarian'
  };

  test('transportSwitch reduces CO2 when switching to metro', () => {
    const modifiedInputs = {
      ...baselineInputs,
      _scenarioType: 'transportSwitch',
      _scenarioNewMode: 'metro',
      _scenarioOldMode: 'car',
      _scenarioTransportFraction: 1 // 100% switch
    };
    const result = calculateImpact(baselineInputs, modifiedInputs, latestEstimation);
    assert.ok(result.projectedCO2 < result.baselineCO2);
    assert.strictEqual(result.co2Saved > 0, true);
  });

  test('walkOrBike reduces commute distance correctly', () => {
    const modifiedInputs = {
      ...baselineInputs,
      weeklyCommuteDistance: 50, // Reduced from 100
      _scenarioType: 'walkOrBike'
    };
    const result = calculateImpact(baselineInputs, modifiedInputs, latestEstimation);
    assert.ok(result.projectedCO2 < result.baselineCO2);
  });

  test('vegetarianDays calculation is deterministic', () => {
    const modifiedInputs = {
      ...baselineInputs,
      _scenarioType: 'vegetarianDays',
      _scenarioDiet_daysVeg: 7,
      _scenarioDiet_originalDietType: 'non_vegetarian'
    };
    const r1 = calculateImpact(baselineInputs, modifiedInputs, latestEstimation);
    const r2 = calculateImpact(baselineInputs, modifiedInputs, latestEstimation);
    assert.strictEqual(r1.projectedCO2, r2.projectedCO2);
  });

  test('reduceAC calculates savings based on KWh saved', () => {
    const modifiedInputs = {
      ...baselineInputs,
      _scenarioType: 'reduceAC',
      _scenarioAcKWhSaved: 100
    };
    const result = calculateImpact(baselineInputs, modifiedInputs, latestEstimation);
    // 100 kWh * 0.82 grid intensity = 82 kg saved
    assert.strictEqual(Math.abs(result.co2Saved - 82) < 0.1, true);
  });

  test('reduceOnlineShopping applies percentage reduction', () => {
    const modifiedInputs = {
      ...baselineInputs,
      _scenarioType: 'reduceOnlineShopping',
      _scenarioShoppingReductionPct: 0.5 // 50% reduction
    };
    // Need to mock baseline shopping for this test to be precise or rely on existing logic
    // For now, checking directionality
    const result = calculateImpact(baselineInputs, modifiedInputs, latestEstimation);
    assert.ok(result.projectedCO2 < result.baselineCO2);
  });

  test('handles zero baseline estimation results gracefully', () => {
    const zeroEst = { totalMonthlyCO2: 0 };
    const result = calculateImpact(baselineInputs, baselineInputs, zeroEst);
    assert.strictEqual(result.baselineCO2, 0);
    assert.strictEqual(result.projectedCO2, 0);
    assert.strictEqual(result.co2Saved, 0);
  });
});
