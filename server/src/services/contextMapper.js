/**
 * Maps raw questionnaire answers into normalized carbon intensity signals.
 * This is used to provide structured data for the downstream Carbon Engine.
 */

// ── Mapping Helpers ─────────────────────────────────────────────────────────

const mapTransportIntensity = (profile, signals) => {
  const { primaryMode, weeklyCommuteDistance, yearlyFlightFrequency } = profile;
  signals.set('dominant_transport_mode', primaryMode);

  // Commute Intensity
  let commuteIntensity = 'low';
  if (weeklyCommuteDistance > 350) commuteIntensity = 'high';
  else if (weeklyCommuteDistance > 70) commuteIntensity = 'moderate';
  signals.set('commute_intensity', commuteIntensity);

  // Travel Intensity
  let travelIntensity = 'low';
  if (yearlyFlightFrequency > 5) travelIntensity = 'extreme';
  else if (yearlyFlightFrequency > 2) travelIntensity = 'high';
  signals.set('travel_intensity', travelIntensity);
};

const mapDietIntensity = (profile, signals) => {
  const { dietStyle } = profile;
  signals.set('diet_style', dietStyle);

  const intensityMap = {
    'non_vegetarian': 'high',
    'mixed_diet': 'moderate',
    'eggetarian': 'low',
    'vegetarian': 'minimal',
  };
  signals.set('diet_intensity', intensityMap[dietStyle] || 'unknown');
};

const mapEnergyIntensity = (profile, signals) => {
  const { acUsage, fanUsage } = profile;
  let intensity = 'low';

  if (acUsage === 'frequently' || acUsage === 'very_frequently') {
    intensity = 'high';
  } else if (acUsage === 'occasionally' || fanUsage === 'very_frequently') {
    intensity = 'moderate';
  }
  signals.set('energy_intensity', intensity);
};

const mapShoppingIntensity = (profile, signals) => {
  const { onlineShoppingFrequency } = profile;
  const shoppingMap = {
    'frequent_online': 'high',
    'occasional': 'moderate',
    'minimal': 'low',
  };
  signals.set('shopping_intensity', shoppingMap[onlineShoppingFrequency] || 'low');
};

const mapLifestyleContext = (profile, signals) => {
  const { householdSize } = profile;
  let context = 'single';
  if (householdSize > 4) context = 'large';
  else if (householdSize > 1) context = 'standard';
  signals.set('household_context', context);
};

// ── Main Mapper ─────────────────────────────────────────────────────────────

export const mapContextToSignals = (context) => {
  const signals = new Map();

  if (context.transportProfile) mapTransportIntensity(context.transportProfile, signals);
  if (context.foodProfile) mapDietIntensity(context.foodProfile, signals);
  if (context.energyProfile) mapEnergyIntensity(context.energyProfile, signals);
  if (context.shoppingProfile) mapShoppingIntensity(context.shoppingProfile, signals);
  if (context.workRoutine) signals.set('work_style', context.workRoutine.type);
  if (context.lifestyleContext) mapLifestyleContext(context.lifestyleContext, signals);

  return Object.fromEntries(signals);
};

