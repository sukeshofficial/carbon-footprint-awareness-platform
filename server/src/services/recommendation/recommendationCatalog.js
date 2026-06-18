const RECOMMENDATION_CATALOG = [
  // Transport
  {
    key: 'transport-metro-switch',
    category: 'transport',
    title: 'Switch to Metro',
    description: 'Switch from driving to using the metro for 3 days a week.',
    co2SavedEstimate: 15.5, // kg per week approx
    moneySavedEstimate: 450, // INR per week approx (fuel + maintenance)
    effortLevel: 'medium',
    baseImpactScore: 8,
  },
  {
    key: 'transport-carpool',
    category: 'transport',
    title: 'Carpool to Work',
    description: 'Find a colleague or neighbor to carpool with on office days.',
    co2SavedEstimate: 12.0,
    moneySavedEstimate: 350,
    effortLevel: 'medium',
    baseImpactScore: 7,
  },
  {
    key: 'transport-reduce-cabs',
    category: 'transport',
    title: 'Reduce Cab Usage',
    description: 'Avoid short-distance cab rides and use public transport or walk.',
    co2SavedEstimate: 5.0,
    moneySavedEstimate: 600,
    effortLevel: 'low',
    baseImpactScore: 5,
  },
  {
    key: 'transport-walk-short',
    category: 'transport',
    title: 'Walk Short Routes',
    description: 'Walk for trips less than 2km instead of taking a vehicle.',
    co2SavedEstimate: 3.0,
    moneySavedEstimate: 150,
    effortLevel: 'low',
    baseImpactScore: 4,
  },

  // Food
  {
    key: 'food-vegetarian-days',
    category: 'food',
    title: 'More Vegetarian Days',
    description: 'Add 2 more vegetarian days to your weekly meal plan.',
    co2SavedEstimate: 8.5,
    moneySavedEstimate: 200,
    effortLevel: 'low',
    baseImpactScore: 6,
  },
  {
    key: 'food-reduce-beef-mutton',
    category: 'food',
    title: 'Reduce High-Impact Meat',
    description: 'Replace beef or mutton meals with chicken, fish, or plant-based options.',
    co2SavedEstimate: 12.5,
    moneySavedEstimate: 300,
    effortLevel: 'medium',
    baseImpactScore: 8,
  },
  {
    key: 'food-avoid-delivery',
    category: 'food',
    title: 'Avoid Food Delivery',
    description: 'Reduce food delivery orders to cut down on packaging and transport emissions.',
    co2SavedEstimate: 2.5,
    moneySavedEstimate: 500, // Service fees + delivery charges
    effortLevel: 'medium',
    baseImpactScore: 3,
  },

  // Energy
  {
    key: 'energy-reduce-ac',
    category: 'energy',
    title: 'Reduce AC Usage',
    description: 'Use the AC for 2 hours less per day by using fans or better ventilation.',
    co2SavedEstimate: 10.0,
    moneySavedEstimate: 400,
    effortLevel: 'low',
    baseImpactScore: 7,
  },
  {
    key: 'energy-optimize-ac-temp',
    category: 'energy',
    title: 'Optimize AC Temperature',
    description: 'Set your AC to 24°C-26°C instead of lower temperatures.',
    co2SavedEstimate: 4.5,
    moneySavedEstimate: 180,
    effortLevel: 'low',
    baseImpactScore: 5,
  },
  {
    key: 'energy-use-fan',
    category: 'energy',
    title: 'Use Fan When Possible',
    description: 'Switch to a fan during cooler hours instead of keeping the AC on.',
    co2SavedEstimate: 7.0,
    moneySavedEstimate: 280,
    effortLevel: 'low',
    baseImpactScore: 6,
  },
  {
    key: 'energy-unplug-appliances',
    category: 'energy',
    title: 'Unplug Standby Appliances',
    description: 'Unplug electronics when not in use to avoid phantom energy drain.',
    co2SavedEstimate: 1.5,
    moneySavedEstimate: 50,
    effortLevel: 'low',
    baseImpactScore: 2,
  },

  // Shopping
  {
    key: 'shopping-reduce-delivery',
    category: 'shopping',
    title: 'Reduce Delivery Frequency',
    description: 'Batch your online orders to reduce the number of deliveries.',
    co2SavedEstimate: 3.5,
    moneySavedEstimate: 100, // Delivery fees
    effortLevel: 'low',
    baseImpactScore: 4,
  },
  {
    key: 'shopping-avoid-impulse',
    category: 'shopping',
    title: 'Avoid Impulse Purchases',
    description: 'Wait 24 hours before buying non-essential items online.',
    co2SavedEstimate: 6.0,
    moneySavedEstimate: 1000, // Potential savings on goods
    effortLevel: 'medium',
    baseImpactScore: 5,
  },
  {
    key: 'shopping-choose-local',
    category: 'shopping',
    title: 'Choose Local Products',
    description: 'Buy locally produced goods to reduce shipping emissions.',
    co2SavedEstimate: 4.0,
    moneySavedEstimate: 0,
    effortLevel: 'medium',
    baseImpactScore: 5,
  }
];

export default RECOMMENDATION_CATALOG;
