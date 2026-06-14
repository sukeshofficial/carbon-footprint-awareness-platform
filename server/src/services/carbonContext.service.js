import carbonContextRepository from '../repositories/carbonContext.repository.js';
import { mapContextToSignals } from './contextMapper.js';
import { stepValidators, finalSubmissionValidator } from '../validators/carbonContext.validator.js';

class CarbonContextService {
  constructor() {
    this.mappings = {
      transport: {
        'public': 'bus',
        'car': 'car',
        'bike': 'bike',
        'mixed': 'other',
        'walk': 'walking'
      },
      diet: {
        'vegan': 'vegetarian',
        'vegetarian': 'vegetarian',
        'pescatarian': 'mixed_diet',
        'omnivore': 'non_vegetarian',
        'mixed': 'mixed_diet'
      },
      ac: {
        'none': 'none',
        'low': 'rarely',
        'moderate': 'occasionally',
        'high': 'frequently'
      },
      shoppingFreq: {
        'rarely': 'minimal',
        'monthly': 'occasional',
        'weekly': 'frequent_online',
        'daily': 'frequent_online'
      },
      fashion: {
        'rarely': 'rarely',
        'monthly': 'monthly',
        'quarterly': 'quarterly',
        'moderate': 'semi_annually',
        'low': 'annually'
      },
      gadgets: {
        'every_year': 'every_year',
        'every_2_years': 'every_2_years',
        'balanced': 'every_3_to_5_years',
        'rarely': 'more_than_5_years'
      },
      segregation: {
        'never': 'none',
        'none': 'none',
        'sometimes': 'partial',
        'regularly': 'partial',
        'always': 'complete'
      },
      recycling: {
        'never': 'never',
        'sometimes': 'occasionally',
        'regularly': 'regularly',
        'always': 'always'
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

    // 2. Only sync if context is not already completed
    if (context.draftStatus === 'completed') return;

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
        weeklyCommuteDistance: weeklyDist,
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
      updates.energyProfile = {
        ...context.energyProfile,
        acUsage: this.mappings.ac[acVal] || acVal
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
        plasticUsage: w.plasticUsage // Direct match based on current observation
      };
    }

    // 8. Map Lifestyle/Household
    if (profileData.householdSize) {
      updates.lifestyleContext = {
        ...context.lifestyleContext,
        householdSize: profileData.householdSize
      };
    }

    // 9. Perform update
    if (Object.keys(updates).length > 0) {
      await carbonContextRepository.updateByUserId(userId, {
        ...updates,
        lastAnsweredAt: new Date()
      });
    }
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
