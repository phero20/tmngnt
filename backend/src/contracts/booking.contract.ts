import { createRoute } from '@hono/zod-openapi';
import {
  CreateBookingSchema,
  BookingResponseSchema,
  UpdateBookingStatusSchema,
  UpdatePaymentStatusSchema,
} from '../schemas/booking.schema';
import { z } from '@hono/zod-openapi';

const tags = ['Bookings'];

export const createBookingRoute = createRoute({
  method: 'post',
  path: '/',
  tags,
  summary: 'Create a new booking',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateBookingSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Booking created successfully',
      content: {
        'application/json': {
          schema: BookingResponseSchema,
        },
      },
    },
    400: { description: 'Bad Request (Availability, Validation)' },
    401: { description: 'Unauthorized' },
    404: { description: 'Room not found' },
  },
});

export const listMyBookingsRoute = createRoute({
  method: 'get',
  path: '/my',
  tags,
  summary: 'List my bookings (as Guest)',
  responses: {
    200: {
      description: 'List of bookings found',
      content: {
        'application/json': {
          schema: z.array(BookingResponseSchema),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

export const listHotelBookingsRoute = createRoute({
  method: 'get',
  path: '/hotel',
  tags,
  summary: 'List bookings for my hotels (as Owner)',
  responses: {
    200: {
      description: 'List of bookings found',
      content: {
        'application/json': {
          schema: z.array(BookingResponseSchema),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

export const cancelBookingRoute = createRoute({
  method: 'patch',
  path: '/{id}/cancel',
  tags,
  summary: 'Cancel a booking',
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'Booking cancelled successfully',
      content: {
        'application/json': {
          schema: BookingResponseSchema,
        },
      },
    },
    400: { description: 'Cannot cancel (already cancelled/completed)' }, // Maybe 409? 400 is fine.
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not your booking)' },
    404: { description: 'Booking not found' },
  },
});

export const updateBookingStatusRoute = createRoute({
  method: 'patch',
  path: '/{id}/status',
  tags,
  summary: 'Update booking status (Host/Admin only)',
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateBookingStatusSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Booking status updated',
      content: {
        'application/json': {
          schema: BookingResponseSchema,
        },
      },
    },
    400: { description: 'Bad Request' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not hotel owner)' },
    404: { description: 'Booking not found' },
  },
});

export const updatePaymentStatusRoute = createRoute({
  method: 'patch',
  path: '/{id}/payment-status',
  tags,
  summary: 'Update payment status (Host/Admin only)',
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdatePaymentStatusSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Payment status updated',
      content: {
        'application/json': {
          schema: BookingResponseSchema,
        },
      },
    },
    400: { description: 'Bad Request' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not hotel owner)' },
    404: { description: 'Booking not found' },
  },
});
