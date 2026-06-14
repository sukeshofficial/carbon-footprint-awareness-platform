/**
 * Maps raw questionnaire answers into normalized carbon intensity signals.
 * This is used to provide structured data for the downstream Carbon Engine.
 */
export const mapContextToSignals = (context) => {
  const signals = new Map();

  // 1. Transport Intensity
  if (context.transportProfile) {
    const { primaryMode, weeklyCommuteDistance, yearlyFlightFrequency } = context.transportProfile;

    signals.set('dominant_transport_mode', primaryMode);

    if (weeklyCommuteDistance > 350) {
      signals.set('commute_intensity', 'high');
    } else if (weeklyCommuteDistance > 70) {
      signals.set('commute_intensity', 'moderate');
    } else {
      signals.set('commute_intensity', 'low');
    }

    if (yearlyFlightFrequency > 5) {
      signals.set('travel_intensity', 'extreme');
    } else if (yearlyFlightFrequency > 2) {
      signals.set('travel_intensity', 'high');
    } else {
      signals.set('travel_intensity', 'low');
    }
  }

  // 2. Diet Intensity
  if (context.foodProfile) {
    const { dietStyle } = context.foodProfile;
    signals.set('diet_style', dietStyle);

    const intensityMap = {
      'non_vegetarian': 'high',
      'mixed_diet': 'moderate',
      'eggetarian': 'low',
      'vegetarian': 'minimal',
    };
    signals.set('diet_intensity', intensityMap[dietStyle] || 'unknown');
  }

  // 3. Energy Intensity
  if (context.energyProfile) {
    const { acUsage, fanUsage } = context.energyProfile;
    if (acUsage === 'frequently' || acUsage === 'very_frequently') {
      signals.set('energy_intensity', 'high');
    } else if (acUsage === 'occasionally' || fanUsage === 'very_frequently') {
      signals.set('energy_intensity', 'moderate');
    } else {
      signals.set('energy_intensity', 'low');
    }
  }

  // 4. Shopping Intensity
  if (context.shoppingProfile) {
    const { onlineShoppingFrequency } = context.shoppingProfile;
    const shoppingMap = {
      'frequent_online': 'high',
      'occasional': 'moderate',
      'minimal': 'low',
    };
    signals.set('shopping_intensity', shoppingMap[onlineShoppingFrequency] || 'low');
  }

  // 5. Work Style
  if (context.workRoutine) {
    signals.set('work_style', context.workRoutine.type);
  }

  // 6. Lifestyle Context
  if (context.lifestyleContext) {
    const { householdSize } = context.lifestyleContext;
    signals.set('household_context', householdSize > 4 ? 'large' : householdSize > 1 ? 'standard' : 'single');
  }

  return Object.fromEntries(signals);
};
