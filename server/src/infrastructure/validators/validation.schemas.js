import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().trim().email('Invalid email format').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  username: z.string().trim().min(3, 'Username must be at least 3 characters').toLowerCase(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// ─── What-If Schemas ─────────────────────────────────────────────────────────

export const scenarioInputSchema = z.object({
  templateId: z.string(),
  inputPayload: z.record(z.any()).refine((data) => {
    // Basic structural check — specific templates can have more strict rules
    return Object.keys(data).length > 0 || ['reduce_ac_usage', 'reduce_online_orders'].includes(data.templateId);
  }, { message: 'Input payload cannot be empty for this scenario' }),
});

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

// ─── Recommendation Schemas ──────────────────────────────────────────────────

export const recommendationFeedbackSchema = z.object({
  status: z.enum(['active', 'accepted', 'completed', 'dismissed']),
});
