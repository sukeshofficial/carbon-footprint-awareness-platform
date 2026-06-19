import mongoose from 'mongoose';
import {
  TRANSPORT_MODES,
  DIET_STYLES,
  HOME_TYPES,
  AC_USAGE_LEVELS,
  FAN_USAGE_LEVELS,
  SHOPPING_FREQUENCIES,
  FASHION_PURCHASE_FREQUENCIES,
  GADGET_UPGRADE_CYCLES,
  WORK_ROUTINES,
  CITY_TYPES,
  RECYCLING_HABITS,
  WASTE_SEGREGATION_LEVELS,
  PLASTIC_USAGE_LEVELS,
  ONBOARDING_DRAFT_STATUS,
  QUESTIONNAIRE_VERSION,
} from '../../../../shared/constants/carbonContext.enums.js';

const carbonContextSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    questionnaireVersion: {
      type: String,
      default: QUESTIONNAIRE_VERSION,
    },
    transportProfile: {
      primaryMode: { type: String, enum: TRANSPORT_MODES },
      secondaryMode: { type: String, enum: TRANSPORT_MODES },
      weeklyCommuteDistance: { type: Number },
      weeklyTravelFrequency: { type: String }, // e.g., "3_times_a_week"
      yearlyFlightFrequency: { type: Number },
    },
    foodProfile: {
      dietStyle: { type: String, enum: DIET_STYLES },
    },
    energyProfile: {
      acUsage: { type: String, enum: AC_USAGE_LEVELS },
      fanUsage: { type: String, enum: FAN_USAGE_LEVELS },
      homeType: { type: String, enum: HOME_TYPES },
      billAwareness: { type: Boolean },
    },
    shoppingProfile: {
      onlineShoppingFrequency: { type: String, enum: SHOPPING_FREQUENCIES },
      fashionPurchaseFrequency: { type: String, enum: FASHION_PURCHASE_FREQUENCIES },
      gadgetUpgradeCycle: { type: String, enum: GADGET_UPGRADE_CYCLES },
    },
    workRoutine: {
      type: { type: String, enum: WORK_ROUTINES },
    },
    lifestyleContext: {
      cityType: { type: String, enum: CITY_TYPES },
      householdSize: { type: Number },
    },
    wasteProfile: {
      recyclingHabit: { type: String, enum: RECYCLING_HABITS },
      wasteSegregation: { type: String, enum: WASTE_SEGREGATION_LEVELS },
      plasticUsage: { type: String, enum: PLASTIC_USAGE_LEVELS },
    },
    derivedCarbonSignals: {
      type: Map,
      of: String,
      default: {},
    },
    completionStep: {
      type: Number,
      default: 0,
    },
    skippedSections: [
      {
        type: String,
      },
    ],
    draftStatus: {
      type: String,
      enum: ONBOARDING_DRAFT_STATUS,
      default: 'in_progress',
    },
    carbonContextReady: {
      type: Boolean,
      default: false,
    },
    lastAnsweredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
carbonContextSchema.index({ userId: 1 });
carbonContextSchema.index({ draftStatus: 1 });

const CarbonContext = mongoose.model('CarbonContext', carbonContextSchema);

export default CarbonContext;
