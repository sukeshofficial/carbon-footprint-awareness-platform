/**
 * Rules for mapping signals to explanation keys.
 * Rules are evaluated against the current estimation and normalized inputs.
 */

export const summaryRules = [
  {
    id: 'high_transport',
    condition: (signals) => signals.topSource === 'Transport',
  },
  {
    id: 'high_food',
    condition: (signals) => signals.topSource === 'Food',
  },
  {
    id: 'high_energy',
    condition: (signals) => signals.topSource === 'Energy',
  },
  {
    id: 'high_shopping',
    condition: (signals) => signals.topSource === 'Shopping',
  },
  {
    id: 'improved',
    condition: (signals) => signals.trendLabel === 'improved',
  },
  {
    id: 'increased',
    condition: (signals) => signals.trendLabel === 'increased',
  },
];

export const categoryRules = {
  transport: [
    {
      id: 'long_commute',
      condition: (inputs) => inputs.weeklyCommuteDistance > 100,
    },
    {
      id: 'car_dependent',
      condition: (inputs) => inputs.primaryMode === 'car' || inputs.primaryMode === 'motorbike',
    },
    {
      id: 'frequent_flights',
      condition: (inputs) => inputs.yearlyFlightFrequency > 2,
    },
  ],
  food: [
    {
      id: 'meat_heavy',
      condition: (inputs) => inputs.dietType === 'meat_heavy' || inputs.dietType === 'mixed_diet',
    },
    {
      id: 'plant_forward',
      condition: (inputs) => inputs.dietType === 'vegan' || inputs.dietType === 'vegetarian',
    },
  ],
  energy: [
    {
      id: 'ac_intensive',
      condition: (inputs) => inputs.acUsage === 'daily' || inputs.acUsage === 'frequent',
    },
    {
      id: 'high_usage',
      condition: (inputs) => inputs.householdSize > 3 || inputs.homeType === 'large_house' || inputs.homeType === 'bungalow',
    },
  ],
  shopping: [
    {
      id: 'high_frequency',
      condition: (inputs) => inputs.onlineShoppingFrequency === 'weekly' || inputs.fashionPurchaseFrequency === 'monthly' || inputs.fashionPurchaseFrequency === 'weekly',
    },
    {
      id: 'tech_heavy',
      condition: (inputs) => inputs.gadgetUpgradeCycle === 'every_year' || inputs.gadgetUpgradeCycle === 'every_2_years',
    },
  ],
};

export const habitRules = [
  {
    id: 'daily_car_use',
    condition: (inputs) => (inputs.primaryMode === 'car' || inputs.primaryMode === 'motorbike') && inputs.weeklyTravelFrequency !== '0_times_a_week',
  },
  {
    id: 'long_distance_commute',
    condition: (inputs) => inputs.weeklyCommuteDistance > 200,
  },
  {
    id: 'frequent_flying',
    condition: (inputs) => inputs.yearlyFlightFrequency > 5,
  },
  {
    id: 'high_meat_consumption',
    condition: (inputs) => inputs.dietType === 'meat_heavy',
  },
];

export const recommendationRules = [
  {
    id: 'reduce_commute',
    condition: (inputs, signals) => signals.topSource === 'Transport' && inputs.workRoutine === 'offline_commute',
  },
  {
    id: 'shift_transport',
    condition: (inputs, signals) => signals.topSource === 'Transport' && (inputs.primaryMode === 'car' || inputs.primaryMode === 'motorbike'),
  },
  {
    id: 'diet_shift',
    condition: (inputs, signals) => signals.topSource === 'Food' && (inputs.dietType === 'mixed_diet' || inputs.dietType === 'meat_heavy'),
  },
  {
    id: 'energy_efficiency',
    condition: (inputs, signals) => signals.topSource === 'Energy',
  },
  {
    id: 'mindful_shopping',
    condition: (inputs, signals) => signals.topSource === 'Shopping',
  },
];
