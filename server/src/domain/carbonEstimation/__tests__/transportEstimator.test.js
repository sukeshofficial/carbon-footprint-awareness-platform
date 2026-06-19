import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { estimateTransport } from '../transportEstimator.js';
import { TRANSPORT_CONVERSION_FACTORS, FLIGHT_FACTORS } from '../../../config/carbonEstimation.config.js';

describe('estimateTransport', () => {
  // ─── Happy paths ───────────────────────────────────────────────────────────

  test('driving 100 km/week in a car produces the expected monthly CO2', () => {
    const monthlyKm = 100 * 4.33;
    const expected = monthlyKm * TRANSPORT_CONVERSION_FACTORS.car;
    const result = estimateTransport({ primaryMode: 'car', secondaryMode: null, weeklyCommuteDistance: 100, yearlyFlightFrequency: 0 });
    assert.ok(Math.abs(result - expected) < 0.01, `Expected ~${expected.toFixed(2)}, got ${result.toFixed(2)}`);
  });

  test('walking produces zero commute CO2', () => {
    const result = estimateTransport({ primaryMode: 'walking', secondaryMode: null, weeklyCommuteDistance: 50, yearlyFlightFrequency: 0 });
    assert.ok(result === 0);
  });

  test('one domestic flight per year adds expected monthly CO2', () => {
    const expectedFlight = FLIGHT_FACTORS.domestic / 12;
    const result = estimateTransport({ primaryMode: 'walking', secondaryMode: null, weeklyCommuteDistance: 0, yearlyFlightFrequency: 1 });
    assert.ok(Math.abs(result - expectedFlight) < 0.01, `Expected ~${expectedFlight.toFixed(2)}, got ${result.toFixed(2)}`);
  });

  test('secondary mode splits commute distance 70 / 30', () => {
    const km = 100;
    const monthly = km * 4.33;
    const expected = (monthly * 0.7 * TRANSPORT_CONVERSION_FACTORS.car) + (monthly * 0.3 * TRANSPORT_CONVERSION_FACTORS.metro);
    const result = estimateTransport({ primaryMode: 'car', secondaryMode: 'metro', weeklyCommuteDistance: km, yearlyFlightFrequency: 0 });
    assert.ok(Math.abs(result - expected) < 0.01);
  });

  test('cab has higher CO2 per km than bus', () => {
    const inputs = { secondaryMode: null, weeklyCommuteDistance: 100, yearlyFlightFrequency: 0 };
    const byCab = estimateTransport({ ...inputs, primaryMode: 'cab' });
    const byBus = estimateTransport({ ...inputs, primaryMode: 'bus' });
    assert.ok(byCab > byBus);
  });

  // ─── Edge cases ────────────────────────────────────────────────────────────

  test('zero weekly distance and zero flights produces 0', () => {
    const result = estimateTransport({ primaryMode: 'car', secondaryMode: null, weeklyCommuteDistance: 0, yearlyFlightFrequency: 0 });
    assert.ok(result === 0);
  });

  test('unknown primary mode falls back to walking (0)', () => {
    const result = estimateTransport({ primaryMode: 'hoverboard', secondaryMode: null, weeklyCommuteDistance: 100, yearlyFlightFrequency: 0 });
    assert.ok(result === 0, 'Unknown mode should treat as walking');
  });

  test('multiple flights per year scale linearly', () => {
    const one = estimateTransport({ primaryMode: 'walking', secondaryMode: null, weeklyCommuteDistance: 0, yearlyFlightFrequency: 1 });
    const ten = estimateTransport({ primaryMode: 'walking', secondaryMode: null, weeklyCommuteDistance: 0, yearlyFlightFrequency: 10 });
    assert.ok(Math.abs(ten - one * 10) < 0.01, 'Flights should scale linearly');
  });
});
