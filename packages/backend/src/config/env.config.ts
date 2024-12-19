import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  JWT_REFRESH_EXPIRATION: z.string(),

  // OpenAI
  OPENAI_API_KEY: z.string(),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number),
  UPLOAD_DIR: z.string(),
  ALLOWED_FILE_TYPES: z.string(),

  // Server
  PORT: z.string().transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env); 