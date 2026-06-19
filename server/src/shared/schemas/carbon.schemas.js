import { z } from 'zod';

export const carbonInputSchema = z.object({
  vehicleType: z.string().optional(),
  mileage: z.coerce.number().min(0).optional(),
});

export const scenarioInputSchema = z.object({
  templateId: z.string(),
  inputPayload: z.record(z.any()),
}).refine((data) => {
  // Allow empty payload only for specific templates that have defaults
  return Object.keys(data.inputPayload).length > 0 ||
    ['reduce_ac_usage', 'reduce_online_orders', 'switch_to_metro', 'switch_to_bus'].includes(data.templateId);
}, { message: 'Input payload cannot be empty for this scenario' });

export const switchToTransportSchema = z.object({
  daysPerWeek: z.number().min(1).max(7).default(5),
});

export const walkOrBikeSchema = z.object({
  kmsPerDay: z.number().min(0.1).max(50).default(5),
});

export const vegetarianDaysSchema = z.object({
  daysPerWeek: z.number().min(1).max(7).default(3),
});

export const reduceAcSchema = z.object({
  hoursReduced: z.number().min(0.5).max(24).default(1),
});

export const reduceOnlineOrdersSchema = z.object({
  reductionPercentage: z.number().min(1).max(100).default(50),
});

export const recommendationFeedbackSchema = z.object({
  status: z.enum(['active', 'accepted', 'completed', 'dismissed']),
});
