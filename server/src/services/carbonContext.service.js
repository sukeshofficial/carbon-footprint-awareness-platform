import carbonContextRepository from '../infrastructure/repositories/carbonContext.repository.js';
import { mapContextToSignals } from './contextMapper.js';
import { stepValidators } from '../infrastructure/validators/carbonContext.validator.js';
import { mapValue, inverseMap, CONTEXT_MAPPINGS, STEP_ORDER, QUESTIONNAIRE_CONFIG } from '../shared/constants/carbonContext.constants.js';

/**
 * Converts a daily commute distance and travel frequency into a weekly distance.
 * @param {number} dailyDist
 * @param {string} freq
 * @returns {number}
 */
function computeWeeklyDistance(dailyDist, freq) {
  if (freq === 'daily') return dailyDist * 7;
  if (freq === 'moderate') return dailyDist * 3;
  return dailyDist; // 'rarely' or unknown — treat as 1 day/week
}

class CarbonContextService {
  async getCompletionProgress(userId) {
    const context = await carbonContextRepository.findByUserId(userId);
    if (!context) {
      return {
        completionStep: 0,
        draftStatus: 'in_progress',
        carbonContextReady: false,
      };
    }
    return context;
  }

  async saveStepResponse(userId, stepKey, stepData) {
    // 1. Validate step data
    const validator = stepValidators[stepKey];
    if (!validator) {
      throw new Error(`Invalid step key: ${stepKey}`);
    }

    const validatedData = validator.parse(stepData);

    // 2. Determine new completion step
    const currentStepIndex = STEP_ORDER.indexOf(stepKey);
    const completionStep = currentStepIndex + 1;

    // 3. Save to repository
    return await carbonContextRepository.updateStep(userId, stepKey, validatedData, completionStep);
  }

  async completeOnboarding(userId) {
    // 1. Fetch current context
    const context = await carbonContextRepository.findByUserId(userId);
    if (!context) {
      throw new Error('Onboarding context not found');
    }

    // 2. Validate final submission (optional but recommended)
    // We can be lenient here if some optional sections were skipped

    // 3. Map to signals
    const derivedSignals = mapContextToSignals(context);

    // 4. Mark as complete
    return await carbonContextRepository.markAsComplete(userId, derivedSignals);
  }

  async skipSection(userId, sectionKey) {
    const context = await carbonContextRepository.findByUserId(userId) || {};
    const skippedSections = context.skippedSections || [];

    if (!skippedSections.includes(sectionKey)) {
      skippedSections.push(sectionKey);
    }

    const currentStepIndex = STEP_ORDER.indexOf(sectionKey);
    const completionStep = Math.max(context.completionStep || 0, currentStepIndex + 1);

    return await carbonContextRepository.updateByUserId(userId, {
      skippedSections,
      completionStep,
      lastAnsweredAt: new Date(),
    });
  }

  async syncFromProfile(userId, profileData) {
    // 1. Fetch current context or create empty object
    const context = await carbonContextRepository.findByUserId(userId) || {};

    // 2. We sync even if completed, to keep profile and context aligned for calculations
    // But we might want to handle it differently if it's completed (e.g., re-triggering estimation)

    const updates = {};

    // 3. Map Transport
    if (profileData.transportProfile) {
      const pMode = profileData.transportProfile.primaryTransportMode;
      const dailyDist = profileData.transportProfile.commuteDistance || 0;
      const freq = profileData.transportProfile.travelFrequency || 'daily';
      const weeklyDist = computeWeeklyDistance(dailyDist, freq);

      updates.transportProfile = {
        ...context.transportProfile,
        primaryMode: mapValue('transport', pMode),
        secondaryMode: mapValue('transport', profileData.transportProfile.secondaryTransportMode),
        weeklyCommuteDistance: profileData.transportProfile.weeklyCommuteDistance || weeklyDist,
        yearlyFlightFrequency: profileData.transportProfile.flightFrequency
      };
    }

    // 4. Map Food
    if (profileData.foodProfile) {
      const dType = profileData.foodProfile.dietType;
      updates.foodProfile = {
        ...context.foodProfile,
        dietStyle: mapValue('diet', dType)
      };
    }

    // 5. Map Energy
    if (profileData.energyProfile) {
      const acVal = profileData.energyProfile.acUsage;
      const fanVal = profileData.energyProfile.fanUsage;
      updates.energyProfile = {
        ...context.energyProfile,
        acUsage: mapValue('usageLevels', acVal),
        fanUsage: mapValue('usageLevels', fanVal),
        homeType: profileData.householdType, // Sync homeType from householdType
        billAwareness: profileData.energyProfile.billAwareness
      };
    }

    // 6. Map Shopping
    if (profileData.shoppingProfile) {
      const s = profileData.shoppingProfile;
      updates.shoppingProfile = {
        ...context.shoppingProfile,
        onlineShoppingFrequency: mapValue('shoppingFreq', s.onlineShoppingFrequency),
        fashionPurchaseFrequency: mapValue('fashion', s.fashionPurchaseFrequency),
        gadgetUpgradeCycle: mapValue('gadgets', s.gadgetUpgradeCycle)
      };
    }

    // 7. Map Waste
    if (profileData.wasteProfile) {
      const w = profileData.wasteProfile;
      updates.wasteProfile = {
        ...context.wasteProfile,
        wasteSegregation: mapValue('segregation', w.wasteSegregation),
        recyclingHabit: mapValue('recycling', w.recyclingHabit),
        plasticUsage: w.plasticUsage
      };
    }

    // 8. Map Lifestyle/Household
    if (profileData.householdSize !== undefined || profileData.lifestyleContext?.cityType) {
      updates.lifestyleContext = {
        ...context.lifestyleContext,
        householdSize: profileData.householdSize !== undefined ? profileData.householdSize : context.lifestyleContext?.householdSize,
        cityType: profileData.lifestyleContext?.cityType || context.lifestyleContext?.cityType
      };
    }

    // 9. Map Work/Routine
    if (profileData.workRoutine?.type) {
      updates.workRoutine = {
        ...context.workRoutine,
        type: profileData.workRoutine.type
      };
    }

    // 10. Perform update
    if (Object.keys(updates).length > 0) {
      await carbonContextRepository.updateByUserId(userId, {
        ...updates,
        lastAnsweredAt: new Date()
      });
    }
  }

  async syncToProfile(userId, existingProfile) {
    const context = await carbonContextRepository.findByUserId(userId);
    if (!context) return { data: existingProfile, changed: false };

    const profileUpdates = { ...(existingProfile.toObject?.() || existingProfile) };
    let changed = false;

    // Helper to track changes
    const applySync = (syncFn, categoryData) => {
      if (categoryData) {
        const result = syncFn(categoryData, profileUpdates);
        if (result) changed = true;
      }
    };

    applySync(this._syncTransport, context.transportProfile);
    applySync(this._syncFood, context.foodProfile);
    applySync(this._syncEnergy, context.energyProfile);
    applySync(this._syncShopping, context.shoppingProfile);
    applySync(this._syncWaste, context.wasteProfile);
    applySync(this._syncLifestyle, context);

    return { data: profileUpdates, changed };
  }

  _syncTransport(t, profileUpdates) {
    let changed = false;
    if (!profileUpdates.transportProfile) profileUpdates.transportProfile = {};
    const p = profileUpdates.transportProfile;

    if (!p.primaryTransportMode && t.primaryMode) {
      p.primaryTransportMode = inverseMap(CONTEXT_MAPPINGS.transport, t.primaryMode);
      changed = true;
    }
    if (!p.secondaryTransportMode && t.secondaryMode) {
      p.secondaryTransportMode = inverseMap(CONTEXT_MAPPINGS.transport, t.secondaryMode);
      changed = true;
    }
    if (!p.weeklyCommuteDistance && t.weeklyCommuteDistance) {
      p.weeklyCommuteDistance = t.weeklyCommuteDistance;
      changed = true;
    }
    if (!p.flightFrequency && t.yearlyFlightFrequency) {
      p.flightFrequency = t.yearlyFlightFrequency;
      changed = true;
    }
    return changed;
  }

  _syncFood(f, profileUpdates) {
    let changed = false;
    if (!profileUpdates.foodProfile) profileUpdates.foodProfile = {};
    const p = profileUpdates.foodProfile;

    if (!p.dietType && f.dietStyle) {
      p.dietType = inverseMap(CONTEXT_MAPPINGS.diet, f.dietStyle);
      changed = true;
    }
    return changed;
  }

  _syncEnergy(e, profileUpdates) {
    let changed = false;
    if (!profileUpdates.energyProfile) profileUpdates.energyProfile = {};
    const p = profileUpdates.energyProfile;

    if (!p.acUsage && e.acUsage) {
      p.acUsage = inverseMap(CONTEXT_MAPPINGS.usageLevels, e.acUsage);
      changed = true;
    }
    if (!p.fanUsage && e.fanUsage) {
      p.fanUsage = inverseMap(CONTEXT_MAPPINGS.usageLevels, e.fanUsage);
      changed = true;
    }
    if (p.billAwareness === undefined && e.billAwareness !== undefined) {
      p.billAwareness = e.billAwareness;
      changed = true;
    }
    if (!profileUpdates.householdType && e.homeType) {
      profileUpdates.householdType = e.homeType;
      changed = true;
    }
    return changed;
  }

  _syncShopping(s, profileUpdates) {
    let changed = false;
    if (!profileUpdates.shoppingProfile) profileUpdates.shoppingProfile = {};
    const p = profileUpdates.shoppingProfile;

    if (!p.onlineShoppingFrequency && s.onlineShoppingFrequency) {
      p.onlineShoppingFrequency = inverseMap(CONTEXT_MAPPINGS.shoppingFreq, s.onlineShoppingFrequency);
      changed = true;
    }
    if (!p.fashionPurchaseFrequency && s.fashionPurchaseFrequency) {
      p.fashionPurchaseFrequency = inverseMap(CONTEXT_MAPPINGS.fashion, s.fashionPurchaseFrequency);
      changed = true;
    }
    if (!p.gadgetUpgradeCycle && s.gadgetUpgradeCycle) {
      p.gadgetUpgradeCycle = inverseMap(CONTEXT_MAPPINGS.gadgets, s.gadgetUpgradeCycle);
      changed = true;
    }
    return changed;
  }

  _syncWaste(w, profileUpdates) {
    let changed = false;
    if (!profileUpdates.wasteProfile) profileUpdates.wasteProfile = {};
    const p = profileUpdates.wasteProfile;

    if (!p.wasteSegregation && w.wasteSegregation) {
      p.wasteSegregation = inverseMap(CONTEXT_MAPPINGS.segregation, w.wasteSegregation);
      changed = true;
    }
    if (!p.recyclingHabit && w.recyclingHabit) {
      p.recyclingHabit = inverseMap(CONTEXT_MAPPINGS.recycling, w.recyclingHabit);
      changed = true;
    }
    if (!p.plasticUsage && w.plasticUsage) {
      p.plasticUsage = w.plasticUsage;
      changed = true;
    }
    return changed;
  }

  _syncLifestyle(context, profileUpdates) {
    let changed = false;
    if (context.lifestyleContext) {
      if (context.lifestyleContext.householdSize && !profileUpdates.householdSize) {
        profileUpdates.householdSize = context.lifestyleContext.householdSize;
        changed = true;
      }
      if (context.lifestyleContext.cityType && (!profileUpdates.lifestyleContext || !profileUpdates.lifestyleContext.cityType)) {
        if (!profileUpdates.lifestyleContext) profileUpdates.lifestyleContext = {};
        profileUpdates.lifestyleContext.cityType = context.lifestyleContext.cityType;
        changed = true;
      }
    }

    if (context.workRoutine?.type && (!profileUpdates.workRoutine || !profileUpdates.workRoutine.type)) {
      if (!profileUpdates.workRoutine) profileUpdates.workRoutine = {};
      profileUpdates.workRoutine.type = context.workRoutine.type;
      changed = true;
    }
    return changed;
  }

  getQuestionnaireConfig() {
    return QUESTIONNAIRE_CONFIG;
  }
}


export default new CarbonContextService();
