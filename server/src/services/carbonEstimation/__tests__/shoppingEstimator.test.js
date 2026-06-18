import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { estimateShopping } from '../shoppingEstimator.js';
import { SHOPPING_FACTORS } from '../../../config/carbonEstimation.config.js';

describe('estimateShopping', () => {
  // ─── Happy paths ───────────────────────────────────────────────────────────

  test('frequent online shopping has higher CO2 than minimal', () => {
    const frequent = estimateShopping({ onlineShoppingFrequency: 'frequent_online', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: 'more_than_5_years' });
    const minimal = estimateShopping({ onlineShoppingFrequency: 'minimal', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: 'more_than_5_years' });
    assert.ok(frequent > minimal);
  });

  test('monthly fashion purchases produces expected CO2', () => {
    const expected = SHOPPING_FACTORS.onlineFrequency.minimal + SHOPPING_FACTORS.fashionFrequency.monthly + SHOPPING_FACTORS.gadgetCycle.more_than_5_years;
    const result = estimateShopping({ onlineShoppingFrequency: 'minimal', fashionPurchaseFrequency: 'monthly', gadgetUpgradeCycle: 'more_than_5_years' });
    assert.ok(Math.abs(result - expected) < 0.01, `Expected ${expected}, got ${result}`);
  });

  test('gadget upgraded yearly adds more CO2 than every 5 years', () => {
    const yearly = estimateShopping({ onlineShoppingFrequency: 'minimal', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: 'every_year' });
    const fiveYears = estimateShopping({ onlineShoppingFrequency: 'minimal', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: 'more_than_5_years' });
    assert.ok(yearly > fiveYears);
  });

  test('total is deterministic for the same inputs', () => {
    const input = { onlineShoppingFrequency: 'occasional', fashionPurchaseFrequency: 'quarterly', gadgetUpgradeCycle: 'every_2_years' };
    const r1 = estimateShopping(input);
    const r2 = estimateShopping(input);
    assert.ok(r1 === r2, 'Result must be deterministic');
  });

  // ─── Edge cases ────────────────────────────────────────────────────────────

  test('unknown online shopping frequency falls back to minimal', () => {
    const result = estimateShopping({ onlineShoppingFrequency: 'obsessive', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: 'more_than_5_years' });
    const fallback = estimateShopping({ onlineShoppingFrequency: 'minimal', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: 'more_than_5_years' });
    assert.ok(Math.abs(result - fallback) < 0.01, 'Unknown frequency should default to minimal');
  });

  test('undefined gadget cycle does not throw and defaults to 0 gadget CO2', () => {
    const result = estimateShopping({ onlineShoppingFrequency: 'minimal', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: undefined });
    const baseline = SHOPPING_FACTORS.onlineFrequency.minimal + SHOPPING_FACTORS.fashionFrequency.rarely;
    assert.ok(Math.abs(result - baseline) < 0.01, 'Undefined gadget cycle should contribute 0');
  });

  test('all minimal values produces lowest possible CO2', () => {
    const min = estimateShopping({ onlineShoppingFrequency: 'minimal', fashionPurchaseFrequency: 'rarely', gadgetUpgradeCycle: 'more_than_5_years' });
    const max = estimateShopping({ onlineShoppingFrequency: 'frequent_online', fashionPurchaseFrequency: 'monthly', gadgetUpgradeCycle: 'every_year' });
    assert.ok(min < max);
  });
});
