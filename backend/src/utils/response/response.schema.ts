import { z } from '@hono/zod-openapi';

/**
 * Standard API Response Schema Wrapper
 * Ensures all API responses follow the envelope pattern: { success, message, data }
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: 'Success' }),
    data: dataSchema.nullable(),
    meta: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      })
      .optional(),
  });

/**
 * Standard Error Response Schema
 * Use this for documenting 4xx/5xx responses
 */
export const ErrorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: 'Error occurred' }),
  errors: z
    .record(z.string(), z.array(z.string()))
    .optional()
    .openapi({
      example: { field: ['Validation error'] },
    }),
});
