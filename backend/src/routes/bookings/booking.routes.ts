import { OpenAPIHono } from '@hono/zod-openapi';
import { BookingController } from '../../controllers/booking.controller';
import { AppBindings } from '../../types/hono.types';
import {
  createBookingRoute,
  listMyBookingsRoute,
  listHotelBookingsRoute,
  cancelBookingRoute,
  updateBookingStatusRoute,
  updatePaymentStatusRoute,
  getRoomAvailabilityRoute,
} from '../../contracts/booking.contract';

export function registerPublicBookingRoutes(
  router: OpenAPIHono<AppBindings>,
  controller: BookingController
) {
  // Get Room Availability (Public/Guest)
  router.openapi(
    getRoomAvailabilityRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.getRoomAvailability(c) as any
  );
}

export function registerProtectedBookingRoutes(
  router: OpenAPIHono<AppBindings>,
  controller: BookingController
) {
  // Create Booking
  router.openapi(
    createBookingRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.createBooking(c) as any
  );

  // List My Bookings (Guest)
  router.openapi(
    listMyBookingsRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.listMyBookings(c) as any
  );

  // List Hotel Bookings (Owner)
  router.openapi(
    listHotelBookingsRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.listHotelBookings(c) as any
  );

  // Cancel Booking
  router.openapi(
    cancelBookingRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.cancelBooking(c) as any
  );

  // Update Booking Status
  router.openapi(
    updateBookingStatusRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.updateBookingStatus(c) as any
  );

  // Update Payment Status
  router.openapi(
    updatePaymentStatusRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => controller.updatePaymentStatus(c) as any
  );
}
