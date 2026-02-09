import { z } from '@hono/zod-openapi';

export const CreateAmenitySchema = z.object({
  name: z.string().min(2).openapi({ example: 'Free WiFi' }),
  icon: z.string().optional().openapi({ example: 'wifi' }),
  category: z
    .string()
    .optional()
    .default('GENERAL')
    .openapi({ example: 'GENERAL' }),
});

export const UpdateAmenitySchema = CreateAmenitySchema.partial();

export const AmenityResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    icon: z.string().nullable(),
    category: z.string().nullable(),
  })
  .openapi({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Free WiFi',
      icon: 'wifi',
      category: 'GENERAL',
    },
  });
