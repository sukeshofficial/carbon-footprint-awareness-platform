/**
 * Normalizes Profile and Carbon Context data into a unified format for the estimation engine.
 * Prioritizes Carbon Context (Feature 3) as the source of truth for lifestyle signals.
 */
export const normalizeInputs = (profile, carbonContext) => {
  const cc = carbonContext || {};
  const pr = profile || {};

  return {
    // Transport
    primaryMode: cc.transportProfile?.primaryMode || pr.transportProfile?.primaryTransportMode || 'walking',
    secondaryMode: cc.transportProfile?.secondaryMode || null,
    weeklyCommuteDistance: cc.transportProfile?.weeklyCommuteDistance || pr.transportProfile?.commuteDistance || 0,
    weeklyTravelFrequency: cc.transportProfile?.weeklyTravelFrequency || pr.transportProfile?.travelFrequency || '0_times_a_week',
    yearlyFlightFrequency: cc.transportProfile?.yearlyFlightFrequency || pr.transportProfile?.flightFrequency || 0,

    // Food
    dietType: cc.foodProfile?.dietStyle || pr.foodProfile?.dietType || 'mixed_diet',

    // Energy
    acUsage: cc.energyProfile?.acUsage || pr.energyProfile?.acUsage || 'none',
    fanUsage: cc.energyProfile?.fanUsage || 'none',
    homeType: cc.energyProfile?.homeType || pr.householdType || 'apartment',
    householdSize: cc.lifestyleContext?.householdSize || pr.householdSize || 1,

    // Shopping
    onlineShoppingFrequency: cc.shoppingProfile?.onlineShoppingFrequency || pr.shoppingProfile?.onlineShoppingFrequency || 'minimal',
    fashionPurchaseFrequency: cc.shoppingProfile?.fashionPurchaseFrequency || pr.shoppingProfile?.fashionPurchaseFrequency || 'rarely',
    gadgetUpgradeCycle: cc.shoppingProfile?.gadgetUpgradeCycle || pr.shoppingProfile?.gadgetUpgradeCycle || 'more_than_5_years',

    // Other
    cityType: cc.lifestyleContext?.cityType || pr.cityRegion || 'tier_1',
    workRoutine: cc.workRoutine?.type || 'offline_commute',
  };
};
