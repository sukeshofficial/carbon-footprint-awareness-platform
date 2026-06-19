import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateResults } from '../carbonAggregation.service.js';
import { SEVERITY_THRESHOLDS } from '../../../config/carbonEstimation.config.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeResults = (overrides = {}) => ({
  transport: 100,
  food: 200,
  energy: 50,
  shopping: 30,
  ...overrides,
});

describe('aggregateResults', () => {
  // ─── Total calculation ─────────────────────────────────────────────────────

  test('totalMonthlyCO2 sums all categories', () => {
    const r = aggregateResults(makeResults({ transport: 100, food: 200, energy: 50, shopping: 30 }), null);
    assert.strictEqual(r.totalMonthlyCO2, 380);
  });

  test('totalWeeklyCO2 is monthly / 4.33', () => {
    const r = aggregateResults(makeResults({ transport: 100, food: 200, energy: 50, shopping: 30 }), null);
    const expected = 380 / 4.33;
    assert.ok(Math.abs(r.totalWeeklyCO2 - expected) < 0.01);
  });

  // ─── Top source ───────────────────────────────────────────────────────────

  test('topSource identifies the highest emitting category', () => {
    const r = aggregateResults(makeResults({ transport: 50, food: 500, energy: 40, shopping: 20 }), null);
    assert.strictEqual(r.topSource, 'Food');
  });

  test('topSource is Transport when transport dominates', () => {
    const r = aggregateResults(makeResults({ transport: 1000, food: 100, energy: 80, shopping: 50 }), null);
    assert.strictEqual(r.topSource, 'Transport');
  });

  // ─── Severity levels ──────────────────────────────────────────────────────

  test('severity is "low" below the low threshold', () => {
    const r = aggregateResults({ transport: 50, food: 50, energy: 50, shopping: 20 }, null);
    // total = 170, below SEVERITY_THRESHOLDS.low (250)
    assert.strictEqual(r.severityLevel, 'low');
  });

  test('severity is "medium" between low and medium thresholds', () => {
    const r = aggregateResults({ transport: 100, food: 200, energy: 100, shopping: 50 }, null);
    // total = 450, between 250 and 600
    assert.strictEqual(r.severityLevel, 'medium');
  });

  test('severity is "high" above the medium threshold', () => {
    const r = aggregateResults({ transport: 300, food: 300, energy: 150, shopping: 100 }, null);
    // total = 850, above 600
    assert.strictEqual(r.severityLevel, 'high');
  });

  test('severity thresholds are respected at exact boundary values', () => {
    const atLow = aggregateResults({ transport: SEVERITY_THRESHOLDS.low, food: 0, energy: 0, shopping: 0 }, null);
    assert.strictEqual(atLow.severityLevel, 'low');

    const atMedium = aggregateResults({ transport: SEVERITY_THRESHOLDS.medium, food: 0, energy: 0, shopping: 0 }, null);
    assert.strictEqual(atMedium.severityLevel, 'medium');

    const overMedium = aggregateResults({ transport: SEVERITY_THRESHOLDS.medium + 1, food: 0, energy: 0, shopping: 0 }, null);
    assert.strictEqual(overMedium.severityLevel, 'high');
  });

  // ─── Trend label ──────────────────────────────────────────────────────────

  test('trendLabel is "new" when no previous estimation exists', () => {
    const r = aggregateResults(makeResults(), null);
    assert.strictEqual(r.trendLabel, 'new');
  });

  test('trendLabel is "stable" when change is within 2%', () => {
    const prev = { totalMonthlyCO2: 380 };
    const r = aggregateResults(makeResults({ transport: 100, food: 200, energy: 50, shopping: 30 }), prev);
    assert.strictEqual(r.trendLabel, 'stable');
  });

  test('trendLabel is "improved" when CO2 decreased by more than 2%', () => {
    const prev = { totalMonthlyCO2: 500 };
    const r = aggregateResults({ transport: 80, food: 150, energy: 50, shopping: 20 }, prev);
    // total = 300, down from 500 (-40%)
    assert.strictEqual(r.trendLabel, 'improved');
  });

  test('trendLabel is "increased" when CO2 increased by more than 2%', () => {
    const prev = { totalMonthlyCO2: 200 };
    const r = aggregateResults({ transport: 100, food: 200, energy: 50, shopping: 30 }, prev);
    // total = 380, up from 200 (+90%)
    assert.strictEqual(r.trendLabel, 'increased');
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────

  test('result includes all required output fields', () => {
    const r = aggregateResults(makeResults(), null);
    for (const key of ['transportCO2', 'foodCO2', 'energyCO2', 'shoppingCO2', 'totalMonthlyCO2', 'totalWeeklyCO2', 'topSource', 'severityLevel', 'trendLabel']) {
      assert.ok(key in r, `Missing field: ${key}`);
    }
  });

  test('all zeros still produces a valid shape', () => {
    const r = aggregateResults({ transport: 0, food: 0, energy: 0, shopping: 0 }, null);
    assert.strictEqual(r.totalMonthlyCO2, 0);
    assert.strictEqual(r.severityLevel, 'low');
    assert.strictEqual(r.trendLabel, 'new');
  });
});
