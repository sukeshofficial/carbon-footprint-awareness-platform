import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInputs } from '../inputNormalizer.js';

describe('normalizeInputs', () => {
  // ─── Carbon Context takes priority ────────────────────────────────────────

  test('carbon context values take priority over profile values', () => {
    const profile = { transportProfile: { primaryTransportMode: 'car' } };
    const cc = { transportProfile: { primaryMode: 'metro' } };
    const result = normalizeInputs(profile, cc);
    assert.strictEqual(result.primaryMode, 'metro', 'CC should override profile transport mode');
  });

  test('profile values are used as fallback when CC has no data', () => {
    const profile = { transportProfile: { primaryTransportMode: 'bus' } };
    const result = normalizeInputs(profile, null);
    assert.strictEqual(result.primaryMode, 'bus');
  });

  // ─── Default fallbacks ────────────────────────────────────────────────────

  test('missing transport defaults to walking', () => {
    const result = normalizeInputs(null, null);
    assert.strictEqual(result.primaryMode, 'walking');
  });

  test('missing diet defaults to mixed_diet', () => {
    const result = normalizeInputs(null, null);
    assert.strictEqual(result.dietType, 'mixed_diet');
  });

  test('missing energy defaults to none for AC and fan', () => {
    const result = normalizeInputs(null, null);
    assert.strictEqual(result.acUsage, 'none');
    assert.strictEqual(result.fanUsage, 'none');
  });

  test('missing household size defaults to 1', () => {
    const result = normalizeInputs(null, null);
    assert.strictEqual(result.householdSize, 1);
  });

  test('missing weekly commute distance defaults to 0', () => {
    const result = normalizeInputs(null, null);
    assert.strictEqual(result.weeklyCommuteDistance, 0);
  });

  test('missing flight frequency defaults to 0', () => {
    const result = normalizeInputs(null, null);
    assert.strictEqual(result.yearlyFlightFrequency, 0);
  });

  test('missing shopping defaults to minimal', () => {
    const result = normalizeInputs(null, null);
    assert.strictEqual(result.onlineShoppingFrequency, 'minimal');
    assert.strictEqual(result.fashionPurchaseFrequency, 'rarely');
    assert.strictEqual(result.gadgetUpgradeCycle, 'more_than_5_years');
  });

  // ─── Mixed sources ────────────────────────────────────────────────────────

  test('CC diet overrides profile diet', () => {
    const profile = { foodProfile: { dietType: 'non_vegetarian' } };
    const cc = { foodProfile: { dietStyle: 'vegetarian' } };
    const result = normalizeInputs(profile, cc);
    assert.strictEqual(result.dietType, 'vegetarian');
  });

  test('commuteDistance from profile is converted to weekly when weeklyCommuteDistance not set', () => {
    const profile = { transportProfile: { commuteDistance: 10 } };
    const result = normalizeInputs(profile, null);
    // 10 * 5 = 50
    assert.strictEqual(result.weeklyCommuteDistance, 50);
  });

  // ─── Output shape ─────────────────────────────────────────────────────────

  test('returns all required keys in the output object', () => {
    const result = normalizeInputs(null, null);
    const expectedKeys = [
      'primaryMode', 'secondaryMode', 'weeklyCommuteDistance', 'yearlyFlightFrequency',
      'dietType', 'acUsage', 'fanUsage', 'homeType', 'householdSize',
      'onlineShoppingFrequency', 'fashionPurchaseFrequency', 'gadgetUpgradeCycle',
      'cityType', 'workRoutine',
    ];
    for (const key of expectedKeys) {
      assert.ok(key in result, `Missing key: ${key}`);
    }
  });
});
