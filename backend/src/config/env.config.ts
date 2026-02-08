const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  NODE_ENV: process.env.NODE_ENV || 'development',
  BETTER_AUTH_BASE_URL:
    process.env.BETTER_AUTH_BASE_URL || 'http://localhost:3000',
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET || 'dev-secret-do-not-use-in-prod',
  BETTER_AUTH_TRUSTED_ORIGINS:
    process.env.BETTER_AUTH_TRUSTED_ORIGINS || 'http://localhost:3000',
};

export const envConfig = {
  get: <K extends keyof typeof env>(key: K): NonNullable<(typeof env)[K]> => {
    if (!env[key]) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return env[key] as NonNullable<(typeof env)[K]>;
  },
};
