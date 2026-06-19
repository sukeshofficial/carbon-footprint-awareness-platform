import { z } from 'zod';
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
} from '../../../../shared/constants/carbonContext.enums.js';

const transportStepSchema = z.object({
  primaryMode: z.enum(TRANSPORT_MODES),
  secondaryMode: z.enum(TRANSPORT_MODES).optional(),
  weeklyCommuteDistance: z.number().nonnegative().optional(),
  weeklyTravelFrequency: z.string().optional(),
  yearlyFlightFrequency: z.number().int().nonnegative().optional(),
});

const dietStepSchema = z.object({
  dietStyle: z.enum(DIET_STYLES),
});

const energyStepSchema = z.object({
  acUsage: z.enum(AC_USAGE_LEVELS).optional(),
  fanUsage: z.enum(FAN_USAGE_LEVELS).optional(),
  homeType: z.enum(HOME_TYPES).optional(),
  billAwareness: z.boolean().optional(),
});

const shoppingStepSchema = z.object({
  onlineShoppingFrequency: z.enum(SHOPPING_FREQUENCIES).optional(),
  fashionPurchaseFrequency: z.enum(FASHION_PURCHASE_FREQUENCIES).optional(),
  gadgetUpgradeCycle: z.enum(GADGET_UPGRADE_CYCLES).optional(),
});

const routineStepSchema = z.object({
  type: z.enum(WORK_ROUTINES),
});

const lifestyleStepSchema = z.object({
  cityType: z.enum(CITY_TYPES).optional(),
  householdSize: z.number().int().positive().optional(),
});

const wasteStepSchema = z.object({
  recyclingHabit: z.enum(RECYCLING_HABITS).optional(),
  wasteSegregation: z.enum(WASTE_SEGREGATION_LEVELS).optional(),
  plasticUsage: z.enum(PLASTIC_USAGE_LEVELS).optional(),
});

export const stepValidators = {
  travel: transportStepSchema,
  diet: dietStepSchema,
  energy: energyStepSchema,
  shopping: shoppingStepSchema,
  routine: routineStepSchema,
  lifestyle: lifestyleStepSchema,
  waste: wasteStepSchema,
};

export const carbonContextValidator = z.object({
  transportProfile: transportStepSchema.partial(),
  foodProfile: dietStepSchema.partial(),
  energyProfile: energyStepSchema.partial(),
  shoppingProfile: shoppingStepSchema.partial(),
  workRoutine: routineStepSchema.partial(),
  lifestyleContext: lifestyleStepSchema.partial(),
  wasteProfile: wasteStepSchema.partial(),
  completionStep: z.number().int().min(0).optional(),
  skippedSections: z.array(z.string()).optional(),
});

export const finalSubmissionValidator = z.object({
  transportProfile: transportStepSchema,
  foodProfile: dietStepSchema,
  workRoutine: routineStepSchema,
  // Others are technically optional based on the prompt but should be checked if provided
  energyProfile: energyStepSchema.optional(),
  shoppingProfile: shoppingStepSchema.optional(),
  lifestyleContext: lifestyleStepSchema.optional(),
  wasteProfile: wasteStepSchema.optional(),
});
