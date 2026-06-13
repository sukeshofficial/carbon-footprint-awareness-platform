import { z } from 'zod';
import { USER_TYPES, TONE_PREFERENCES, HOUSEHOLD_TYPES } from '../constants/profile.enums.js';

const profileSchema = z.object({
  displayName: z.string().min(1).max(50).trim(),
  cityRegion: z.string().min(1).max(100).trim(),
  householdType: z.enum(HOUSEHOLD_TYPES),
  userType: z.enum(USER_TYPES),
  tonePreference: z.enum(TONE_PREFERENCES),
  ageGroup: z.string().optional(),
  householdSize: z.number().int().positive().optional(),
  regionCode: z.string().max(10).optional(),
  occupationLabel: z.string().max(100).optional(),

  // New Category Fields
  transportProfile: z.object({
    primaryTransportMode: z.string().optional(),
    commuteDistance: z.number().optional(),
    travelFrequency: z.string().optional(),
    flightFrequency: z.number().optional(),
  }).optional(),
  foodProfile: z.object({
    dietType: z.string().optional(),
    foodOrderingFrequency: z.string().optional(),
    groceryPreference: z.string().optional(),
  }).optional(),
  energyProfile: z.object({
    electricityUsage: z.coerce.number().optional(),
    acUsage: z.string().optional(),
    applianceCount: z.coerce.number().optional(),
  }).optional(),
  shoppingProfile: z.object({
    onlineShoppingFrequency: z.string().optional(),
    fashionPurchaseFrequency: z.string().optional(),
    gadgetUpgradeCycle: z.string().optional(),
  }).optional(),
  wasteProfile: z.object({
    wasteSegregation: z.string().optional(),
    recyclingHabit: z.string().optional(),
    plasticUsage: z.string().optional(),
  }).optional(),

  // Tracking
  completionStep: z.number().int().min(0).max(8).optional(),
  skippedSections: z.array(z.string()).optional(),
  isOnboardingCompleted: z.boolean().optional(),
  profileCompletenessScore: z.number().min(0).max(100).optional(),
});

export const createProfileValidator = profileSchema;

export const updateProfileValidator = profileSchema.partial();

export const patchPreferencesValidator = z.object({
  tonePreference: z.enum(TONE_PREFERENCES).optional(),
  userType: z.enum(USER_TYPES).optional(),
}).strict();
