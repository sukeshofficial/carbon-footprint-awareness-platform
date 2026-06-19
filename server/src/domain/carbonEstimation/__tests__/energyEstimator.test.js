import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { estimateEnergy } from '../energyEstimator.js';
import { ENERGY_FACTORS } from '../../../config/carbonEstimation.config.js';

describe('estimateEnergy', () => {
  // ─── Happy paths ───────────────────────────────────────────────────────────

  test('no AC or fan with household of 1 returns baseline CO2 only', () => {
    const result = estimateEnergy({ acUsage: 'none', fanUsage: 'none', householdSize: 1 });
    const expected = ENERGY_FACTORS.householdBasePerPerson * ENERGY_FACTORS.gridIntensity;
    assert.ok(Math.abs(result - expected) < 0.01, `Expected ~${expected.toFixed(2)}, got ${result.toFixed(2)}`);
  });

  test('more AC usage increases CO2', () => {
    const low = estimateEnergy({ acUsage: 'rarely', fanUsage: 'none', householdSize: 1 });
    const high = estimateEnergy({ acUsage: 'very_frequently', fanUsage: 'none', householdSize: 1 });
    assert.ok(high > low);
  });

  test('larger household reduces individual CO2 share', () => {
    const single = estimateEnergy({ acUsage: 'frequently', fanUsage: 'frequently', householdSize: 1 });
    const family = estimateEnergy({ acUsage: 'frequently', fanUsage: 'frequently', householdSize: 4 });
    assert.ok(family < single, 'Larger household should share the burden');
  });

  test('frequently AC usage produces expected value for single person', () => {
    const acKWh = ENERGY_FACTORS.ac.frequently;
    const fanKWh = ENERGY_FACTORS.fan.rarely;
    const base = ENERGY_FACTORS.householdBasePerPerson;
    const expected = (acKWh + fanKWh + base) * ENERGY_FACTORS.gridIntensity;
    const result = estimateEnergy({ acUsage: 'frequently', fanUsage: 'rarely', householdSize: 1 });
    assert.ok(Math.abs(result - expected) < 0.01);
  });

  // ─── Edge cases ────────────────────────────────────────────────────────────

  test('householdSize of 0 falls back to 1 (no division by zero)', () => {
    const result = estimateEnergy({ acUsage: 'none', fanUsage: 'none', householdSize: 0 });
    assert.ok(result > 0, 'Should not return 0 or throw for householdSize=0');
  });

  test('unknown AC usage level defaults to 0 extra kWh', () => {
    const withUnknown = estimateEnergy({ acUsage: 'turbo_boost', fanUsage: 'none', householdSize: 1 });
    const withNone = estimateEnergy({ acUsage: 'none', fanUsage: 'none', householdSize: 1 });
    assert.ok(Math.abs(withUnknown - withNone) < 0.01, 'Unknown AC usage should default to 0');
  });

  test('returns a positive number in all normal scenarios', () => {
    const levels = ['none', 'rarely', 'occasionally', 'frequently', 'very_frequently'];
    for (const ac of levels) {
      const result = estimateEnergy({ acUsage: ac, fanUsage: 'occasionally', householdSize: 2 });
      assert.ok(result > 0, `Expected positive result for acUsage=${ac}`);
    }
  });
});
