import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mapValue, inverseMap, CONTEXT_MAPPINGS, STEP_ORDER, QUESTIONNAIRE_CONFIG } from '../../../constants/carbonContext.constants.js';

describe('mapValue', () => {
  test('maps a known canonical value to itself', () => {
    assert.strictEqual(mapValue('transport', 'car'), 'car');
  });

  test('maps an alias to its canonical value', () => {
    assert.strictEqual(mapValue('transport', 'walk'), 'walking');
    assert.strictEqual(mapValue('diet', 'vegan'), 'vegetarian');
    assert.strictEqual(mapValue('diet', 'omnivore'), 'non_vegetarian');
    assert.strictEqual(mapValue('usageLevels', 'high'), 'frequently');
    assert.strictEqual(mapValue('shoppingFreq', 'weekly'), 'frequent_online');
    assert.strictEqual(mapValue('fashion', 'moderate'), 'semi_annually');
    assert.strictEqual(mapValue('gadgets', 'balanced'), 'every_3_to_5_years');
    assert.strictEqual(mapValue('segregation', 'always'), 'complete');
    assert.strictEqual(mapValue('recycling', 'sometimes'), 'occasionally');
  });

  test('passes through unknown values unchanged', () => {
    assert.strictEqual(mapValue('transport', 'teleporter'), 'teleporter');
    assert.strictEqual(mapValue('diet', 'fruitarian'), 'fruitarian');
  });

  test('returns null for null input', () => {
    assert.strictEqual(mapValue('transport', null), null);
  });

  test('returns undefined for undefined input', () => {
    assert.strictEqual(mapValue('transport', undefined), undefined);
  });
});

describe('inverseMap', () => {
  test('canonical value that maps to itself is returned as-is', () => {
    assert.strictEqual(inverseMap(CONTEXT_MAPPINGS.transport, 'car'), 'car');
  });

  test('finds the first key whose value equals the canonical target', () => {
    // 'vegan' -> 'vegetarian', so inverseMap('vegetarian') should return 'vegetarian' or 'vegan'
    const result = inverseMap(CONTEXT_MAPPINGS.diet, 'vegetarian');
    // Either 'vegetarian' (canonical) or 'vegan' (first alias) are acceptable
    assert.ok(['vegetarian', 'vegan'].includes(result), `Unexpected inverse result: ${result}`);
  });

  test('passes through unknown canonical values', () => {
    assert.strictEqual(inverseMap(CONTEXT_MAPPINGS.transport, 'submarine'), 'submarine');
  });
});

describe('STEP_ORDER', () => {
  test('contains exactly 7 steps', () => {
    assert.strictEqual(STEP_ORDER.length, 7);
  });

  test('travel is the first step', () => {
    assert.strictEqual(STEP_ORDER[0], 'travel');
  });

  test('waste is the last step', () => {
    assert.strictEqual(STEP_ORDER[STEP_ORDER.length - 1], 'waste');
  });

  test('contains all expected keys', () => {
    const expected = ['travel', 'diet', 'energy', 'shopping', 'routine', 'lifestyle', 'waste'];
    assert.deepStrictEqual(STEP_ORDER, expected);
  });
});

describe('QUESTIONNAIRE_CONFIG', () => {
  test('has a version field', () => {
    assert.ok(QUESTIONNAIRE_CONFIG.version);
  });

  test('has 7 steps matching STEP_ORDER', () => {
    assert.strictEqual(QUESTIONNAIRE_CONFIG.steps.length, STEP_ORDER.length);
  });

  test('each step has a key, label, required flag, and questions array', () => {
    for (const step of QUESTIONNAIRE_CONFIG.steps) {
      assert.ok(typeof step.key === 'string', `Step missing key`);
      assert.ok(typeof step.label === 'string', `Step missing label`);
      assert.ok(typeof step.required === 'boolean', `Step missing required flag`);
      assert.ok(Array.isArray(step.questions), `Step missing questions array`);
    }
  });

  test('step keys match STEP_ORDER exactly', () => {
    const configKeys = QUESTIONNAIRE_CONFIG.steps.map(s => s.key);
    assert.deepStrictEqual(configKeys, STEP_ORDER);
  });

  test('required steps are travel, diet, and routine', () => {
    const requiredSteps = QUESTIONNAIRE_CONFIG.steps.filter(s => s.required).map(s => s.key);
    assert.deepStrictEqual(requiredSteps.sort((a, b) => a.localeCompare(b)), ['diet', 'routine', 'travel']);
  });
});
