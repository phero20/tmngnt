import { z } from 'zod';

/**
 * Environment variables schema.
 * Only variables prefixed with NEXT_PUBLIC_ are available on the client.
 */
const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url().default('http://localhost:8000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;

export const envConfig = {
  get: <K extends keyof typeof env>(key: K) => env[key],
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
};
