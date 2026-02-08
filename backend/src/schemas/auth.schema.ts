import { z } from '@hono/zod-openapi';

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

export const ErrorSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'Error occurred' }),
  data: z.null().openapi({ example: null }),
});

export const SuccessSchema = (schema: z.ZodType) =>
  z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: 'Success' }),
    data: schema,
  });
