import { z } from 'zod';

export const carbonInputSchema = z.object({
  body: z.object({
    vehicleType: z.string().optional(),
    mileage: z.coerce.number().min(0).optional(),
  }),
});

export const scenarioInputSchema = z.object({
  body: z.object({
    templateId: z.string(),
    inputPayload: z.record(z.any()),
  }),
});

export const switchToTransportSchema = z.object({
  body: z.object({
    fraction: z.number().min(0).max(1),
  }),
});

export const walkOrBikeSchema = z.object({
  body: z.object({
    tripsPerWeek: z.number().int().min(0),
  }),
});

export const vegetarianDaysSchema = z.object({
  body: z.object({
    daysPerWeek: z.number().int().min(0).max(7),
  }),
});

export const reduceAcSchema = z.object({
  body: z.object({
    hoursReduced: z.number().min(0).max(24),
  }),
});

export const reduceOnlineOrdersSchema = z.object({
  body: z.object({
    ordersReduced: z.number().int().min(0),
  }),
});

export const recommendationFeedbackSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'completed', 'dismissed']),
  }),
});
