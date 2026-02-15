import { Context } from 'hono';
import { BookingService } from '../services/booking.service';
import {
  CreateBookingSchema,
  UpdateBookingStatusSchema,
  UpdatePaymentStatusSchema,
} from '../schemas/booking.schema';
import { ok, created } from '../utils/response/api-response';
import { AppBindings } from '../types/hono.types';
import { UnauthorizedError } from '../utils/errors/http-error';

export class BookingController {
  private bookingService: BookingService;

  constructor(bookingService: BookingService) {
    this.bookingService = bookingService;
  }

  /**
   * Create a new booking
   */
  public createBooking = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await c.req.json();
    const validData = CreateBookingSchema.parse(body);

    const booking = await this.bookingService.createBooking(user.id, validData);
    return created(c, booking, 'Booking created successfully');
  };

  /**
   * List bookings for the current user (Guest)
   * Supports Query Params: ?page=1&limit=10
   */
  public listMyBookings = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    if (!user) {
      throw new UnauthorizedError();
    }

    const query = c.req.query();
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;

    const bookings = await this.bookingService.listMyBookings(user.id, {
      page,
      limit,
    });
    return ok(c, bookings);
  };

  /**
   * List bookings for hotels owned by the current user (Hotel Owner)
   * Supports Query Params: ?page=1&limit=10
   */
  public listHotelBookings = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    if (!user) {
      throw new UnauthorizedError();
    }

    const query = c.req.query();
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;

    const bookings = await this.bookingService.listHotelBookings(user.id, {
      page,
      limit,
    });
    return ok(c, bookings);
  };

  /**
   * Cancel a booking
   */
  public cancelBooking = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    const bookingId = c.req.param('id');

    if (!user) {
      throw new UnauthorizedError();
    }

    const result = await this.bookingService.cancelBooking(bookingId, user.id);
    return ok(c, result, 'Booking cancelled successfully');
  };

  /**
   * Update booking status
   */
  public updateBookingStatus = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    const bookingId = c.req.param('id');

    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await c.req.json();
    const validData = UpdateBookingStatusSchema.parse(body);

    const result = await this.bookingService.updateBookingStatus(
      bookingId,
      user.id,
      validData.status
    );
    return ok(c, result, 'Booking status updated successfully');
  };

  /**
   * Update payment status
   */
  public updatePaymentStatus = async (c: Context<AppBindings>) => {
    const user = c.get('user');
    const bookingId = c.req.param('id');

    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await c.req.json();
    const validData = UpdatePaymentStatusSchema.parse(body);

    const result = await this.bookingService.updatePaymentStatus(
      bookingId,
      user.id,
      validData.paymentStatus
    );
    return ok(c, result, 'Payment status updated successfully');
  };

  getRoomAvailability = async (c: Context<AppBindings>) => {
    const { roomId } = c.req.param();
    const result = await this.bookingService.getRoomAvailability(roomId);
    return ok(c, result, 'Room availability fetched successfully');
  };
}
