/**
 * Scenario Definitions and Templates for the What-If Simulator.
 * This file defines the baseline assumptions and impact logic for various lifestyle changes.
 */

export const SCENARIO_TYPES = {
  TRANSPORT: 'transport',
  FOOD: 'food',
  ENERGY: 'energy',
  SHOPPING: 'shopping',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const SCENARIO_TEMPLATES = [
  // Transport Scenarios
  {
    id: 'switch_to_metro',
    type: SCENARIO_TYPES.TRANSPORT,
    title: 'Switch to Metro',
    description: 'Replace your primary car/bike commute with the Metro.',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    inputs: [
      {
        key: 'daysPerWeek',
        label: 'Days per week',
        type: 'slider',
        min: 1,
        max: 7,
        default: 5,
      },
    ],
  },
  {
    id: 'switch_to_bus',
    type: SCENARIO_TYPES.TRANSPORT,
    title: 'Switch to Bus',
    description: 'Use public bus for your daily commute.',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    inputs: [
      {
        key: 'daysPerWeek',
        label: 'Days per week',
        type: 'slider',
        min: 1,
        max: 7,
        default: 5,
      },
    ],
  },
  {
    id: 'walk_or_bike',
    type: SCENARIO_TYPES.TRANSPORT,
    title: 'Walk or Bike More',
    description: 'Choose zero-emission transport for short distances.',
    difficulty: DIFFICULTY_LEVELS.EASY,
    inputs: [
      {
        key: 'kmsPerDay',
        label: 'Kms per day replaced',
        type: 'slider',
        min: 1,
        max: 20,
        default: 5,
      },
    ],
  },

  // Food Scenarios
  {
    id: 'vegetarian_days',
    type: SCENARIO_TYPES.FOOD,
    title: 'Vegetarian Days',
    description: 'Commit to meat-free days every week.',
    difficulty: DIFFICULTY_LEVELS.EASY,
    inputs: [
      {
        key: 'daysPerWeek',
        label: 'Veg days per week',
        type: 'slider',
        min: 1,
        max: 7,
        default: 3,
      },
    ],
  },

  // Energy Scenarios
  {
    id: 'reduce_ac_usage',
    type: SCENARIO_TYPES.ENERGY,
    title: 'Reduce AC Usage',
    description: 'Lower your air conditioning usage by 1 hour daily.',
    difficulty: DIFFICULTY_LEVELS.EASY,
    inputs: [
      {
        key: 'hoursReduced',
        label: 'Hours reduced per day',
        type: 'slider',
        min: 1,
        max: 8,
        default: 1,
      },
    ],
  },

  // Shopping Scenarios
  {
    id: 'reduce_online_orders',
    type: SCENARIO_TYPES.SHOPPING,
    title: 'Reduce Online Orders',
    description: 'Consolidate deliveries or shop locally to reduce packaging and transport footprint.',
    difficulty: DIFFICULTY_LEVELS.EASY,
    inputs: [
      {
        key: 'reductionPercentage',
        label: '% reduction in orders',
        type: 'slider',
        min: 10,
        max: 90,
        default: 50,
      },
    ],
  },
];

/**
 * Monetary savings multipliers (Approximate ₹ saved per unit)
 * These are directional for the Indian context.
 */
export const SAVINGS_MULTIPLIERS = {
  transport: {
    car_to_metro: 8,   // ₹ saved per km (fuel + maintenance - ticket)
    bike_to_metro: 2,  // ₹ saved per km
    cab_to_metro: 15,  // ₹ saved per km
  },
  energy: {
    ac_per_hour: 12,   // ₹ saved per hour (avg 1.5 ton AC @ ₹8/unit)
  },
  food: {
    meat_to_veg_per_meal: 50,  // ₹ saved per meal
  },
};
