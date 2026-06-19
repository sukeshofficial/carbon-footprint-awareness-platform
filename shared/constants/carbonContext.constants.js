/**
 * carbonContext.constants.js
 *
 * Centralised source of truth for all Carbon Context mappings and
 * questionnaire configuration.  Extracted from CarbonContextService so that
 * mapping logic can be unit-tested and reused independently.
 */

/**
 * Canonical step order used for progress tracking.
 * @type {string[]}
 */
export const STEP_ORDER = ['travel', 'diet', 'energy', 'shopping', 'routine', 'lifestyle', 'waste'];

/**
 * Enum-normalisation maps.
 * Each map accepts a raw incoming value (from Profile or external sources)
 * and returns the canonical value used inside Carbon Context documents.
 * Unknown values fall back to themselves (pass-through).
 */
export const CONTEXT_MAPPINGS = {
  transport: {
    car: 'car',
    bike: 'bike',
    bus: 'bus',
    metro: 'metro',
    train: 'train',
    cab: 'cab',
    walking: 'walking',
    mixed: 'other',
    public: 'bus',
    walk: 'walking',
  },

  diet: {
    vegan: 'vegetarian',
    vegetarian: 'vegetarian',
    eggetarian: 'eggetarian',
    pescatarian: 'mixed_diet',
    omnivore: 'non_vegetarian',
    mixed: 'mixed_diet',
    mixed_diet: 'mixed_diet',
    non_vegetarian: 'non_vegetarian',
  },

  usageLevels: {
    none: 'none',
    rarely: 'rarely',
    occasionally: 'occasionally',
    frequently: 'frequently',
    very_frequently: 'very_frequently',
    // coarse aliases
    low: 'rarely',
    moderate: 'occasionally',
    high: 'frequently',
  },

  shoppingFreq: {
    minimal: 'minimal',
    occasional: 'occasional',
    frequent_online: 'frequent_online',
    // aliases
    rarely: 'minimal',
    average: 'occasional',
    frequent: 'frequent_online',
    monthly: 'occasional',
    weekly: 'frequent_online',
    daily: 'frequent_online',
    moderate: 'occasional',
    Moderate: 'occasional',
  },

  fashion: {
    monthly: 'monthly',
    quarterly: 'quarterly',
    semi_annually: 'semi_annually',
    annually: 'annually',
    rarely: 'rarely',
    // aliases
    moderate: 'semi_annually',
    low: 'annually',
  },

  gadgets: {
    every_year: 'every_year',
    every_2_years: 'every_2_years',
    every_3_to_5_years: 'every_3_to_5_years',
    more_than_5_years: 'more_than_5_years',
    // aliases
    balanced: 'every_3_to_5_years',
    rarely: 'more_than_5_years',
  },

  segregation: {
    none: 'none',
    partial: 'partial',
    complete: 'complete',
    // aliases
    never: 'none',
    sometimes: 'partial',
    regularly: 'partial',
    always: 'complete',
  },

  recycling: {
    never: 'never',
    occasionally: 'occasionally',
    regularly: 'regularly',
    always: 'always',
    // aliases
    sometimes: 'occasionally',
  },
};

/**
 * Returns the canonical value for a given mapping key, falling back to the
 * raw value if no mapping exists.
 *
 * @param {keyof typeof CONTEXT_MAPPINGS} mapKey
 * @param {string | undefined} rawValue
 * @returns {string | undefined}
 */
export const mapValue = (mapKey, rawValue) => {
  if (rawValue === undefined || rawValue === null) return rawValue;
  return CONTEXT_MAPPINGS[mapKey]?.[rawValue] ?? rawValue;
};

/**
 * Returns the first key in a mapping whose value equals `canonicalValue`.
 * Falls back to `canonicalValue` itself when no match is found.
 *
 * @param {Record<string, string>} mapping
 * @param {string} canonicalValue
 * @returns {string}
 */
export const inverseMap = (mapping, canonicalValue) => {
  if (mapping[canonicalValue] === canonicalValue) return canonicalValue;
  return Object.keys(mapping).find((k) => mapping[k] === canonicalValue) ?? canonicalValue;
};

/**
 * Static questionnaire configuration returned to the client for rendering
 * the onboarding flow.  Keeping this here means the service layer stays thin.
 */
export const QUESTIONNAIRE_CONFIG = {
  version: 'v1',
  steps: [
    {
      key: 'travel',
      label: 'Travel Habits',
      required: true,
      questions: [
        { key: 'primaryMode', label: 'Primary Travel Mode', type: 'choice', options: ['car', 'bike', 'bus', 'metro', 'train', 'cab', 'walking'], required: true },
        { key: 'secondaryMode', label: 'Secondary Travel Mode', type: 'choice', options: ['car', 'bike', 'bus', 'metro', 'train', 'cab', 'walking'], required: false },
        { key: 'weeklyCommuteDistance', label: 'Weekly Commute Distance (km)', type: 'number', required: false },
        { key: 'weeklyTravelFrequency', label: 'Weekly Travel Frequency', type: 'choice', options: ['daily', '3_times_a_week', 'rarely'], required: false },
        { key: 'yearlyFlightFrequency', label: 'Yearly Flight Frequency', type: 'number', required: false },
      ],
    },
    {
      key: 'diet',
      label: 'Diet Style',
      required: true,
      questions: [
        { key: 'dietStyle', label: 'Diet Style', type: 'choice', options: ['vegetarian', 'eggetarian', 'mixed_diet', 'non_vegetarian'], required: true },
      ],
    },
    {
      key: 'energy',
      label: 'Home Energy',
      required: false,
      questions: [
        { key: 'acUsage', label: 'AC Usage', type: 'choice', options: ['none', 'rarely', 'occasionally', 'frequently', 'very_frequently'], required: false },
        { key: 'fanUsage', label: 'Fan Usage', type: 'choice', options: ['none', 'rarely', 'occasionally', 'frequently', 'very_frequently'], required: false },
        { key: 'homeType', label: 'Home Type', type: 'choice', options: ['shared_home', 'independent_home', 'apartment'], required: false },
        { key: 'billAwareness', label: 'Are you aware of your electricity bill?', type: 'boolean', required: false },
      ],
    },
    {
      key: 'shopping',
      label: 'Shopping Behavior',
      required: false,
      questions: [
        { key: 'onlineShoppingFrequency', label: 'Online Shopping Frequency', type: 'choice', options: ['frequent_online', 'occasional', 'minimal'], required: false },
        { key: 'fashionPurchaseFrequency', label: 'Fashion Purchase Frequency', type: 'choice', options: ['monthly', 'quarterly', 'semi_annually', 'annually', 'rarely'], required: false },
        { key: 'gadgetUpgradeCycle', label: 'Gadget Upgrade Cycle', type: 'choice', options: ['every_year', 'every_2_years', 'every_3_to_5_years', 'more_than_5_years'], required: false },
      ],
    },
    {
      key: 'routine',
      label: 'Work/Study Routine',
      required: true,
      questions: [
        { key: 'type', label: 'Work/Study Routine', type: 'choice', options: ['offline_commute', 'work_from_home', 'hybrid', 'college_commute'], required: true },
      ],
    },
    {
      key: 'lifestyle',
      label: 'Lifestyle Context',
      required: false,
      questions: [
        { key: 'cityType', label: 'City Type', type: 'choice', options: ['metropolitan', 'tier_1', 'tier_2', 'rural'], required: false },
        { key: 'householdSize', label: 'Household Size', type: 'number', required: false },
      ],
    },
    {
      key: 'waste',
      label: 'Waste Habits',
      required: false,
      questions: [
        { key: 'recyclingHabit', label: 'Recycling Habit', type: 'choice', options: ['never', 'occasionally', 'regularly', 'always'], required: false },
        { key: 'wasteSegregation', label: 'Waste Segregation', type: 'choice', options: ['none', 'partial', 'complete'], required: false },
        { key: 'plasticUsage', label: 'Plastic Usage', type: 'choice', options: ['high', 'moderate', 'low', 'minimal'], required: false },
      ],
    },
  ],
};
