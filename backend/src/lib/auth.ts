import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';
import * as schema from '../db/schema';
import { openAPI } from 'better-auth/plugins';
import { envConfig } from '../config/env.config';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // PostgreSQL
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      image: {
        type: 'string',
        required: false,
      },
    },
    changeEmail: {
      enabled: true,
    },
  },

  baseURL: `${envConfig.get('BETTER_AUTH_BASE_URL')}/api/auth`,
  secret: envConfig.get('BETTER_AUTH_SECRET'),
  trustedOrigins: envConfig.get('BETTER_AUTH_TRUSTED_ORIGINS')
    ? envConfig.get('BETTER_AUTH_TRUSTED_ORIGINS').split(',')
    : [],
  plugins: [
    openAPI({
      path: '/openapi',
    }),
  ],
});
