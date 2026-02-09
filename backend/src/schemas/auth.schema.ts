import { z } from '@hono/zod-openapi';
import {
  ApiResponseSchema,
  ErrorResponseSchema,
} from '../utils/response/response.schema';

export const UserSchema = z.object({
  id: z.string().openapi({ example: 'user_123' }),
  name: z.string().openapi({ example: 'John Doe' }),
  email: z.string().email().openapi({ example: 'john@example.com' }),
  isEmailVerified: z.boolean().default(false),
  image: z
    .string()
    .optional()
    .openapi({ example: 'https://example.com/avatar.jpg' }),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional().openapi({ example: 'John Doe Updated' }),
  image: z
    .string()
    .optional()
    .openapi({ example: 'https://example.com/new-avatar.jpg' }),
});

// Re-export standard schemas for consistency
export const ErrorSchema = ErrorResponseSchema;
export const SuccessSchema = ApiResponseSchema;
