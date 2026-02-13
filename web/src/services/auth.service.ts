import { signIn, signUp, signOut, useSession } from '@/lib/auth-client';
import { LoginFormData, RegisterFormData } from '@/lib/schemas/auth.schema';

/**
 * AuthService
 * Encapsulates all authentication-related API calls.
 * This layer separates the Auth Client implementation from the Hooks/UI.
 */
export const AuthService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginFormData) => {
    return await signIn.email({
      email: data.email,
      password: data.password,
    });
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterFormData) => {
    return await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  },

  /**
   * Sign out the current user
   */
  logout: async () => {
    return await signOut();
  },

  /**
   * Get current session (Client-side)
   */
  getSession: () => {
    // Note: useSession is a hook, so it will still be used in components/hooks.
    // But we can expose it here for architectural completeness.
    return useSession;
  },
};
