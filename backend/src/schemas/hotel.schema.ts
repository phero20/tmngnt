import { z } from '@hono/zod-openapi';

export const CreateHotelSchema = z.object({
  name: z.string().min(3).openapi({ example: 'Grand Plaza' }),
  description: z
    .string()
    .optional()
    .openapi({ example: 'Luxury hotel located downtown' }),
  address: z.string().openapi({ example: '123 Main St' }),
  city: z.string().openapi({ example: 'New York' }),
  state: z.string().optional().openapi({ example: 'NY' }),
  country: z.string().openapi({ example: 'USA' }),
  zipCode: z.string().optional().openapi({ example: '10001' }),
  latitude: z.number().optional().openapi({ example: 40.7128 }),
  longitude: z.number().optional().openapi({ example: -74.006 }),
  contactPhone: z.string().optional().openapi({ example: '+1-555-0123' }),
  contactEmail: z
    .string()
    .email()
    .optional()
    .openapi({ example: 'contact@grandplaza.com' }),
  checkInTime: z.string().default('14:00').openapi({ example: '14:00' }),
  checkOutTime: z.string().default('11:00').openapi({ example: '11:00' }),
  starRating: z.number().min(0).max(5).default(0).openapi({ example: 4 }),
  amenities: z
    .array(z.string().uuid())
    .optional()
    .openapi({ example: ['amenity-uuid-1', 'amenity-uuid-2'] }),
  images: z
    .array(z.string().url())
    .optional()
    .openapi({ example: ['https://example.com/image1.jpg'] }),
});

export const UpdateHotelSchema = CreateHotelSchema.partial();

export const HotelResponseSchema = z
  .object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    address: z.string(),
    city: z.string(),
    state: z.string().nullable(),
    country: z.string(),
    zipCode: z.string().nullable(),
    latitude: z.string().nullable(), // Decimal returns string in JS often
    longitude: z.string().nullable(),
    contactPhone: z.string().nullable(),
    contactEmail: z.string().nullable(),
    checkInTime: z.string().nullable(),
    checkOutTime: z.string().nullable(),
    isActive: z.boolean(),
    starRating: z.number().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    images: z
      .array(
        z.object({
          id: z.string(),
          url: z.string(),
          altText: z.string().nullable(),
        })
      )
      .optional(),
  })
  .openapi({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ownerId: 'user_123',
      name: 'Grand Plaza',
      slug: 'grand-plaza',
      city: 'New York',
      country: 'USA',
      isActive: true,
      starRating: 4,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
  });

export const ListHotelsQuerySchema = z.object({
  page: z.string().optional().default('1').openapi({ example: '1' }),
  limit: z.string().optional().default('10').openapi({ example: '10' }),
  search: z.string().optional().openapi({ example: 'Plaza' }),
  city: z.string().optional().openapi({ example: 'New York' }),
});

// Rooms
export const CreateRoomSchema = z.object({
  name: z.string().min(3).openapi({ example: 'Deluxe Suite' }),
  description: z
    .string()
    .optional()
    .openapi({ example: 'Spacious suite with king bed' }),
  price: z.number().positive().openapi({ example: 250.0 }),
  capacityAdults: z.number().int().min(1).default(2).openapi({ example: 2 }),
  capacityChildren: z.number().int().min(0).default(0).openapi({ example: 2 }),
  quantity: z.number().int().min(1).default(1).openapi({ example: 5 }),
  sizeSqFt: z.number().optional().openapi({ example: 500 }),
  amenities: z
    .array(z.string().uuid())
    .optional()
    .openapi({ example: ['amenity-uuid-1'] }),
  images: z
    .array(z.string().url())
    .optional()
    .openapi({ example: ['https://example.com/room1.jpg'] }),
});

export const UpdateRoomSchema = CreateRoomSchema.partial();

export const RoomResponseSchema = z
  .object({
    id: z.string().uuid(),
    hotelId: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.string(), // Decimal
    capacityAdults: z.number(),
    capacityChildren: z.number(),
    quantity: z.number(),
    sizeSqFt: z.number().nullable(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi({
    example: {
      id: 'room_123',
      hotelId: 'hotel_abc',
      name: 'Deluxe Suite',
      price: '250.00',
      capacityAdults: 2,
      capacityChildren: 0,
      quantity: 5,
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
  });

// Type Aliases for cleaner usage
export type CreateHotelInput = z.infer<typeof CreateHotelSchema>;
export type UpdateHotelInput = z.infer<typeof UpdateHotelSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>;
