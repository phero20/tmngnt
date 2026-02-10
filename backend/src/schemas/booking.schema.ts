import { z } from '@hono/zod-openapi';

export const CreateBookingSchema = z
  .object({
    roomId: z
      .string()
      .uuid()
      .openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    checkIn: z.string().date().openapi({ example: '2023-12-25' }), // ISO Date String YYYY-MM-DD
    checkOut: z.string().date().openapi({ example: '2023-12-30' }),
    adults: z.number().int().min(1).default(1).openapi({ example: 2 }),
    children: z.number().int().min(0).default(0).openapi({ example: 0 }),
    guestName: z.string().optional().openapi({ example: 'John Doe' }),
    guestEmail: z
      .string()
      .email()
      .optional()
      .openapi({ example: 'john@example.com' }),
    specialRequests: z
      .string()
      .optional()
      .openapi({ example: 'Late check-in requested' }),
  })
  .openapi('CreateBookingRequest'); // Optional name registration

export const BookingResponseSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string(),
    hotelId: z.string().uuid(),
    roomId: z.string().uuid(),
    checkIn: z.string(),
    checkOut: z.string(),
    totalPrice: z.string().openapi({ example: '500.00' }),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('BookingResponse');

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
