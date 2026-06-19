import mongoose from 'mongoose';
import { USER_TYPES, TONE_PREFERENCES, HOUSEHOLD_TYPES } from '../../shared/constants/profile.enums.js';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    ageGroup: {
      type: String,
    },
    cityRegion: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    householdType: {
      type: String,
      required: true,
      enum: HOUSEHOLD_TYPES,
    },
    userType: {
      type: String,
      required: true,
      enum: USER_TYPES,
    },
    tonePreference: {
      type: String,
      required: true,
      enum: TONE_PREFERENCES,
    },
    // New Category Fields (Optional/Partial)
    transportProfile: {
      primaryTransportMode: String,
      secondaryTransportMode: String,
      commuteDistance: Number, // Daily
      weeklyCommuteDistance: Number,
      travelFrequency: String,
      flightFrequency: Number,
    },
    foodProfile: {
      dietType: String,
      foodOrderingFrequency: String,
      groceryPreference: String,
    },
    energyProfile: {
      electricityUsage: Number,
      acUsage: String,
      fanUsage: String,
      applianceCount: Number,
      billAwareness: Boolean,
    },
    shoppingProfile: {
      onlineShoppingFrequency: String,
      fashionPurchaseFrequency: String,
      gadgetUpgradeCycle: String,
    },
    wasteProfile: {
      wasteSegregation: String,
      recyclingHabit: String,
      plasticUsage: String,
    },
    workRoutine: {
      type: { type: String },
    },
    lifestyleContext: {
      cityType: String,
    },
    // Tracking & Progressive Onboarding Fields
    skippedSections: {
      type: [String],
      default: [],
    },
    profileCompletenessScore: {
      type: Number,
      default: 0,
    },
    householdSize: {
      type: Number,
      default: 1,
    },
    regionCode: {
      type: String,
    },
    occupationLabel: {
      type: String,
    },
    isOnboardingCompleted: {
      type: Boolean,
      default: false,
    },
    completionStep: {
      type: Number,
      default: 0,
    },
    profileVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
profileSchema.index({ userId: 1 });
profileSchema.index({ userType: 1 });
profileSchema.index({ cityRegion: 1 });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
