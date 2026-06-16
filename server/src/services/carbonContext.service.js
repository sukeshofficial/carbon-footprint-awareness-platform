import carbonContextRepository from '../repositories/carbonContext.repository.js';
import { mapContextToSignals } from './contextMapper.js';
import { stepValidators, finalSubmissionValidator } from '../validators/carbonContext.validator.js';

class CarbonContextService {
  constructor() {
    this.mappings = {
      transport: {
        'car': 'car',
        'bike': 'bike',
        'bus': 'bus',
        'metro': 'metro',
        'train': 'train',
        'cab': 'cab',
        'walking': 'walking',
        'mixed': 'other',
        'public': 'bus',
        'walk': 'walking'
      },
      diet: {
        'vegan': 'vegetarian',
        'vegetarian': 'vegetarian',
        'eggetarian': 'eggetarian',
        'pescatarian': 'mixed_diet',
        'omnivore': 'non_vegetarian',
        'mixed': 'mixed_diet',
        'mixed_diet': 'mixed_diet',
        'non_vegetarian': 'non_vegetarian'
      },
      usageLevels: {
        'none': 'none',
        'rarely': 'rarely',
        'occasionally': 'occasionally',
        'frequently': 'frequently',
        'very_frequently': 'very_frequently',
        'low': 'rarely',
        'moderate': 'occasionally',
        'high': 'frequently'
      },
      shoppingFreq: {
        'minimal': 'minimal',
        'occasional': 'occasional',
        'frequent_online': 'frequent_online',
        'rarely': 'minimal',
        'average': 'occasional',
        'frequent': 'frequent_online',
        'monthly': 'occasional',
        'weekly': 'frequent_online',
        'daily': 'frequent_online'
      },
      fashion: {
        'monthly': 'monthly',
        'quarterly': 'quarterly',
        'semi_annually': 'semi_annually',
        'annually': 'annually',
        'rarely': 'rarely',
        'moderate': 'semi_annually',
        'low': 'annually'
      },
      gadgets: {
        'every_year': 'every_year',
        'every_2_years': 'every_2_years',
        'every_3_to_5_years': 'every_3_to_5_years',
        'more_than_5_years': 'more_than_5_years',
        'balanced': 'every_3_to_5_years',
        'rarely': 'more_than_5_years'
      },
      segregation: {
        'none': 'none',
        'partial': 'partial',
        'complete': 'complete',
        'never': 'none',
        'sometimes': 'partial',
        'regularly': 'partial',
        'always': 'complete'
      },
      recycling: {
        'never': 'never',
        'occasionally': 'occasionally',
        'regularly': 'regularly',
        'always': 'always',
        'sometimes': 'occasionally'
      }
    };
  }

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
    const stepOrder = ['travel', 'diet', 'energy', 'shopping', 'routine', 'lifestyle', 'waste'];
    const currentStepIndex = stepOrder.indexOf(stepKey);
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

    const stepOrder = ['travel', 'diet', 'energy', 'shopping', 'routine', 'lifestyle', 'waste'];
    const currentStepIndex = stepOrder.indexOf(sectionKey);
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

      let weeklyDist = dailyDist;
      if (freq === 'daily') weeklyDist = dailyDist * 7;
      else if (freq === 'moderate') weeklyDist = dailyDist * 3;
      else if (freq === 'rarely') weeklyDist = dailyDist * 1;

      updates.transportProfile = {
        ...context.transportProfile,
        primaryMode: this.mappings.transport[pMode] || pMode,
        secondaryMode: this.mappings.transport[profileData.transportProfile.secondaryTransportMode] || profileData.transportProfile.secondaryTransportMode,
        weeklyCommuteDistance: profileData.transportProfile.weeklyCommuteDistance || weeklyDist,
        yearlyFlightFrequency: profileData.transportProfile.flightFrequency
      };
    }

    // 4. Map Food
    if (profileData.foodProfile) {
      const dType = profileData.foodProfile.dietType;
      updates.foodProfile = {
        ...context.foodProfile,
        dietStyle: this.mappings.diet[dType] || dType
      };
    }

    // 5. Map Energy
    if (profileData.energyProfile) {
      const acVal = profileData.energyProfile.acUsage;
      const fanVal = profileData.energyProfile.fanUsage;
      updates.energyProfile = {
        ...context.energyProfile,
        acUsage: this.mappings.usageLevels[acVal] || acVal,
        fanUsage: this.mappings.usageLevels[fanVal] || fanVal,
        homeType: profileData.householdType, // Sync homeType from householdType
        billAwareness: profileData.energyProfile.billAwareness
      };
    }

    // 6. Map Shopping
    if (profileData.shoppingProfile) {
      const s = profileData.shoppingProfile;
      updates.shoppingProfile = {
        ...context.shoppingProfile,
        onlineShoppingFrequency: this.mappings.shoppingFreq[s.onlineShoppingFrequency] || s.onlineShoppingFrequency,
        fashionPurchaseFrequency: this.mappings.fashion[s.fashionPurchaseFrequency] || s.fashionPurchaseFrequency,
        gadgetUpgradeCycle: this.mappings.gadgets[s.gadgetUpgradeCycle] || s.gadgetUpgradeCycle
      };
    }

    // 7. Map Waste
    if (profileData.wasteProfile) {
      const w = profileData.wasteProfile;
      updates.wasteProfile = {
        ...context.wasteProfile,
        wasteSegregation: this.mappings.segregation[w.wasteSegregation] || w.wasteSegregation,
        recyclingHabit: this.mappings.recycling[w.recyclingHabit] || w.recyclingHabit,
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
    // 1. Fetch current context
    const context = await carbonContextRepository.findByUserId(userId);
    if (!context) return { data: existingProfile, changed: false };

    const profileUpdates = { ...(existingProfile.toObject?.() || existingProfile) };
    let changed = false;

    // Helper for inverse mapping
    const getInverse = (mapping, value) => {
      // Find exact match first
      if (mapping[value] === value) return value;
      return Object.keys(mapping).find(key => mapping[key] === value) || value;
    };

    // 2. Map Transport
    if (context.transportProfile) {
      if (!profileUpdates.transportProfile) profileUpdates.transportProfile = {};
      const t = context.transportProfile;
      const p = profileUpdates.transportProfile;

      if (!p.primaryTransportMode && t.primaryMode) {
        p.primaryTransportMode = getInverse(this.mappings.transport, t.primaryMode);
        changed = true;
      }
      if (!p.secondaryTransportMode && t.secondaryMode) {
        p.secondaryTransportMode = getInverse(this.mappings.transport, t.secondaryMode);
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
    }

    // 3. Map Food
    if (context.foodProfile) {
      if (!profileUpdates.foodProfile) profileUpdates.foodProfile = {};
      const f = context.foodProfile;
      const p = profileUpdates.foodProfile;

      if (!p.dietType && f.dietStyle) {
        p.dietType = getInverse(this.mappings.diet, f.dietStyle);
        changed = true;
      }
    }

    // 4. Map Energy
    if (context.energyProfile) {
      if (!profileUpdates.energyProfile) profileUpdates.energyProfile = {};
      const e = context.energyProfile;
      const p = profileUpdates.energyProfile;

      if (!p.acUsage && e.acUsage) {
        p.acUsage = getInverse(this.mappings.usageLevels, e.acUsage);
        changed = true;
      }
      if (!p.fanUsage && e.fanUsage) {
        p.fanUsage = getInverse(this.mappings.usageLevels, e.fanUsage);
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
    }

    // 5. Map Shopping
    if (context.shoppingProfile) {
      if (!profileUpdates.shoppingProfile) profileUpdates.shoppingProfile = {};
      const s = context.shoppingProfile;
      const p = profileUpdates.shoppingProfile;

      if (!p.onlineShoppingFrequency && s.onlineShoppingFrequency) {
        p.onlineShoppingFrequency = getInverse(this.mappings.shoppingFreq, s.onlineShoppingFrequency);
        changed = true;
      }
      if (!p.fashionPurchaseFrequency && s.fashionPurchaseFrequency) {
        p.fashionPurchaseFrequency = getInverse(this.mappings.fashion, s.fashionPurchaseFrequency);
        changed = true;
      }
      if (!p.gadgetUpgradeCycle && s.gadgetUpgradeCycle) {
        p.gadgetUpgradeCycle = getInverse(this.mappings.gadgets, s.gadgetUpgradeCycle);
        changed = true;
      }
    }

    // 6. Map Waste
    if (context.wasteProfile) {
      if (!profileUpdates.wasteProfile) profileUpdates.wasteProfile = {};
      const w = context.wasteProfile;
      const p = profileUpdates.wasteProfile;

      if (!p.wasteSegregation && w.wasteSegregation) {
        p.wasteSegregation = getInverse(this.mappings.segregation, w.wasteSegregation);
        changed = true;
      }
      if (!p.recyclingHabit && w.recyclingHabit) {
        p.recyclingHabit = getInverse(this.mappings.recycling, w.recyclingHabit);
        changed = true;
      }
      if (!p.plasticUsage && w.plasticUsage) {
        p.plasticUsage = w.plasticUsage;
        changed = true;
      }
    }

    // 7. Map Lifestyle/Routine
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

    return { data: profileUpdates, changed };
  }

  getQuestionnaireConfig() {
    return {
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
          ]
        },
        {
          key: 'diet',
          label: 'Diet Style',
          required: true,
          questions: [
            { key: 'dietStyle', label: 'Diet Style', type: 'choice', options: ['vegetarian', 'eggetarian', 'mixed_diet', 'non_vegetarian'], required: true },
          ]
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
          ]
        },
        {
          key: 'shopping',
          label: 'Shopping Behavior',
          required: false,
          questions: [
            { key: 'onlineShoppingFrequency', label: 'Online Shopping Frequency', type: 'choice', options: ['frequent_online', 'occasional', 'minimal'], required: false },
            { key: 'fashionPurchaseFrequency', label: 'Fashion Purchase Frequency', type: 'choice', options: ['monthly', 'quarterly', 'semi_annually', 'annually', 'rarely'], required: false },
            { key: 'gadgetUpgradeCycle', label: 'Gadget Upgrade Cycle', type: 'choice', options: ['every_year', 'every_2_years', 'every_3_to_5_years', 'more_than_5_years'], required: false },
          ]
        },
        {
          key: 'routine',
          label: 'Work/Study Routine',
          required: true,
          questions: [
            { key: 'type', label: 'Work/Study Routine', type: 'choice', options: ['offline_commute', 'work_from_home', 'hybrid', 'college_commute'], required: true },
          ]
        },
        {
          key: 'lifestyle',
          label: 'Lifestyle Context',
          required: false,
          questions: [
            { key: 'cityType', label: 'City Type', type: 'choice', options: ['metropolitan', 'tier_1', 'tier_2', 'rural'], required: false },
            { key: 'householdSize', label: 'Household Size', type: 'number', required: false },
          ]
        },
        {
          key: 'waste',
          label: 'Waste Habits',
          required: false,
          questions: [
            { key: 'recyclingHabit', label: 'Recycling Habit', type: 'choice', options: ['never', 'occasionally', 'regularly', 'always'], required: false },
            { key: 'wasteSegregation', label: 'Waste Segregation', type: 'choice', options: ['none', 'partial', 'complete'], required: false },
            { key: 'plasticUsage', label: 'Plastic Usage', type: 'choice', options: ['high', 'moderate', 'low', 'minimal'], required: false },
          ]
        }
      ]
    };
  }
}

export default new CarbonContextService();
