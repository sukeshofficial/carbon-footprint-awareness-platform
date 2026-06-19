import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string().default('a_very_long_and_extremely_secret_random_string_for_dev_only'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  OPENROUTER_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const config = {
  env: parsedEnv.data.NODE_ENV,
  port: parseInt(parsedEnv.data.PORT, 10),
  db: {
    url: parsedEnv.data.MONGO_URI,
  },
  auth: {
    jwtSecret: parsedEnv.data.JWT_SECRET,
  },
  urls: {
    frontend: parsedEnv.data.FRONTEND_URL,
  },
  ai: {
    openRouterKey: parsedEnv.data.OPENROUTER_API_KEY,
    model: 'openai/gpt-oss-120b:free', // Centralized default
  },
  cloudinary: {
    cloudName: parsedEnv.data.CLOUDINARY_CLOUD_NAME,
    apiKey: parsedEnv.data.CLOUDINARY_API_KEY,
    apiSecret: parsedEnv.data.CLOUDINARY_API_SECRET,
  }
};

export default config;
