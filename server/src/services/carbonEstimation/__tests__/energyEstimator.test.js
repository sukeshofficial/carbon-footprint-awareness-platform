import { test } from 'node:test';
import assert from 'node:assert';
import { estimateEnergy } from '../energyEstimator.js';

test('estimateEnergy factors in household size', () => {
  const single = estimateEnergy({ acUsage: 'none', fanUsage: 'rarely', householdSize: 1 });
  const shared = estimateEnergy({ acUsage: 'none', fanUsage: 'rarely', householdSize: 4 });

  assert.ok(shared < single);
});

test('estimateEnergy factors in AC usage', () => {
  const withAc = estimateEnergy({ acUsage: 'frequently', fanUsage: 'rarely', householdSize: 1 });
  const withoutAc = estimateEnergy({ acUsage: 'none', fanUsage: 'rarely', householdSize: 1 });

  assert.ok(withAc > withoutAc);
});
