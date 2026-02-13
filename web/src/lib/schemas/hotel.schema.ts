import { z } from 'zod';

export const CreateHotelSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().optional(),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional(),
  checkInTime: z.string().default('14:00'),
  checkOutTime: z.string().default('11:00'),
  starRating: z.number().min(0).max(5).default(0),
  amenities: z.array(z.string().uuid()).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

export const UpdateHotelSchema = CreateHotelSchema.partial();

export const CreateRoomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  capacityAdults: z.number().int().min(1),
  capacityChildren: z.number().int().min(0),
  quantity: z.number().int().min(1),
  sizeSqFt: z.number().optional(),
  amenities: z.array(z.string().uuid()).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

export const UpdateRoomSchema = CreateRoomSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Type Aliases
export type CreateHotelInput = z.infer<typeof CreateHotelSchema>;
export type UpdateHotelInput = z.infer<typeof UpdateHotelSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>;
