import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { envConfig } from '@/config/env.config';

/**
 * Global Axios Instance
 * Configured with baseURL and standard headers.
 */
const apiClient = axios.create({
  baseURL: envConfig.get('NEXT_PUBLIC_BACKEND_URL'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for session cookies
});

/**
 * Response Interceptor: Global Error Handling
 * This acts as our 'Global Error Middleware' for the frontend.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data directly to shorten hook logic
    return response.data;
  },
  (error: AxiosError) => {
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      'An unexpected error occurred';
    const status = error.response?.status;

    // 1. Silent failure for specific statuses if needed
    if (status === 401) {
      // Session expired? Better Auth usually handles redirecting via Middleware,
      // but we can trigger a refresh or specific UI here.
      console.warn('Unauthorized access - potential session expiration');
    }

    // 2. Global UI Feedback (The 'Elite' way)
    // Avoid double-toasting if the hook already handles it,
    // but usually, we want the interceptor to be the 'single source of truth' for errors.
    toast.error(message, {
      id: 'global-api-error', // Prevents toast spamming
    });

    // 3. Reject the promise so the hook still knows it failed
    return Promise.reject(error);
  }
);

export default apiClient;
