const RECOMMENDATION_RULES = {
  // Transport Rules
  'transport-metro-switch': (context, estimation) => {
    return estimation.transportCO2 > 5 && context.transport?.commuteType === 'car';
  },
  'transport-carpool': (context, estimation) => {
    return estimation.transportCO2 > 3 && (context.transport?.commuteType === 'car' || context.transport?.commuteType === 'bike');
  },
  'transport-reduce-cabs': (context, estimation) => {
    return context.transport?.commuteType === 'cab' || context.transport?.frequency === 'daily';
  },
  'transport-walk-short': (context, estimation) => {
    return estimation.transportCO2 > 0;
  },

  // Food Rules
  'food-vegetarian-days': (context, estimation) => {
    return context.diet?.type !== 'vegetarian' && context.diet?.type !== 'vegan';
  },
  'food-reduce-beef-mutton': (context, estimation) => {
    return estimation.foodCO2 > 10 && (context.diet?.meatFrequency === 'daily' || context.diet?.meatFrequency === 'often');
  },
  'food-avoid-delivery': (context, estimation) => {
    return context.lifestyle?.orderingFrequency === 'often' || context.lifestyle?.orderingFrequency === 'daily';
  },

  // Energy Rules
  'energy-reduce-ac': (context, estimation) => {
    return context.energy?.acUsage === 'high' || context.energy?.acUsage === 'moderate';
  },
  'energy-optimize-ac-temp': (context, estimation) => {
    return context.energy?.acUsage === 'high' || context.energy?.acUsage === 'moderate';
  },
  'energy-use-fan': (context, estimation) => {
    return context.lifestyle?.fanUsage === 'low' || context.lifestyle?.fanUsage === 'none';
  },
  'energy-unplug-appliances': (context, estimation) => {
    return estimation.energyCO2 > 2;
  },

  // Shopping Rules
  'shopping-reduce-delivery': (context, estimation) => {
    return context.lifestyle?.shoppingFrequency === 'high' || context.lifestyle?.shoppingFrequency === 'moderate';
  },
  'shopping-avoid-impulse': (context, estimation) => {
    return context.lifestyle?.shoppingFrequency === 'high';
  },
  'shopping-choose-local': (context, estimation) => {
    return estimation.shoppingCO2 > 2;
  }
};

export default RECOMMENDATION_RULES;
