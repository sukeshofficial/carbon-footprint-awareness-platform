import test from 'node:test';
import assert from 'node:assert';
import { PlanGenerator } from '../planGenerator.service.js';

test('PlanGenerator - distributeActions', async (t) => {
  const recommendations = [
    { _id: '1', title: 'Rec 1', impactLevel: 'high', effortLevel: 'high' },
    { _id: '2', title: 'Rec 2', impactLevel: 'medium', effortLevel: 'medium' },
    { _id: '3', title: 'Rec 3', impactLevel: 'low', effortLevel: 'low' },
  ];

  const durationDays = 7;
  const startDate = new Date('2024-01-01');

  await t.test('should distribute 3 recommendations over 7 days correctly', () => {
    const actions = PlanGenerator.distributeActions(recommendations, durationDays, startDate);

    assert.strictEqual(actions.length, 7, 'Should generate one action per day');

    // Check sorting (easy first)
    // Sorted effort: easy (Rec 3), medium (Rec 2), hard (Rec 1)
    assert.strictEqual(actions[0].recommendationId, '3', 'Day 1 should be easiest');
    assert.strictEqual(actions[1].recommendationId, '2', 'Day 2 should be medium');
    assert.strictEqual(actions[2].recommendationId, '1', 'Day 3 should be hard');
    assert.strictEqual(actions[3].recommendationId, '3', 'Day 4 should cycle back to easy');
  });

  await t.test('should set correct scheduled dates', () => {
    const actions = PlanGenerator.distributeActions(recommendations, durationDays, startDate);

    actions.forEach((action, idx) => {
      const expectedDate = new Date(startDate);
      expectedDate.setDate(startDate.getDate() + idx);
      assert.strictEqual(
        action.scheduledDate.toISOString().split('T')[0],
        expectedDate.toISOString().split('T')[0],
        `Day ${idx + 1} date mismatch`
      );
    });
  });
});
