import { z } from 'zod';

export const CreateBookingSchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string().date(), // ISO Date String YYYY-MM-DD
  checkOut: z.string().date(),
  adults: z.number().int().min(1).default(1),
  children: z.number().int().min(0).default(0),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  specialRequests: z.string().optional(),
});

export const BookingResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  hotelId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.string(),
  checkOut: z.string(),
  totalPrice: z.string(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
  createdAt: z.string(),
  updatedAt: z.string(),

  // Optional fields from joins
  guestName: z.string().nullable().optional(),
  guestEmail: z.string().nullable().optional(),

  room: z
    .object({
      name: z.string(),
    })
    .optional(),

  user: z
    .object({
      name: z.string(),
      email: z.string(),
      image: z.string().nullable().optional(),
    })
    .optional(),

  hotel: z
    .object({
      name: z.string(),
      city: z.string().optional(),
      slug: z.string().optional(),
      images: z.array(z.object({ url: z.string() })).optional(),
    })
    .optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

export const UpdatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
});

export type UpdateBookingStatusInput = z.infer<
  typeof UpdateBookingStatusSchema
>;
export type UpdatePaymentStatusInput = z.infer<
  typeof UpdatePaymentStatusSchema
>;

export type Booking = z.infer<typeof BookingResponseSchema>;
