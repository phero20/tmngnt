import { createAuthClient } from 'better-auth/react';

import { envConfig } from '@/config/env.config';

export const authClient = createAuthClient({
  baseURL: envConfig.get('NEXT_PUBLIC_BACKEND_URL'),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
      },
      banned: {
        type: 'boolean',
        required: false,
      },
    },
  },
} as const);

export const { signIn, signUp, signOut, useSession } = authClient;
