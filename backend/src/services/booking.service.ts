import { db } from '../db';
import { BookingRepository } from '../repositories/booking.repository';
import { RoomRepository } from '../repositories/room.repository';
import { HotelRepository } from '../repositories/hotel.repository';
import { CreateBookingInput } from '../schemas/booking.schema';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from '../utils/errors/http-error';

export class BookingService {
  private bookingRepository: BookingRepository;
  private roomRepository: RoomRepository;
  private hotelRepository: HotelRepository;

  constructor(
    bookingRepository: BookingRepository,
    roomRepository: RoomRepository,
    hotelRepository: HotelRepository
  ) {
    this.bookingRepository = bookingRepository;
    this.roomRepository = roomRepository;
    this.hotelRepository = hotelRepository;
  }

  /**
   * Helper: Calculate nights between two dates
   */
  private calculateNights(checkIn: Date, checkOut: Date): number {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nights > 0 ? nights : 0;
  }

  /**
   * Create a new booking with Capacity Check & Transaction
   */
  async createBooking(userId: string, data: CreateBookingInput) {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    // 1. Validate Dates
    if (checkInDate >= checkOutDate) {
      throw new BadRequestError('Check-out date must be after check-in date');
    }

    if (checkInDate < new Date()) {
      // Optional: Prevent past bookings
      // throw new BadRequestError('Cannot book in the past');
    }

    // 2. Transact to prevent Race Conditions (Overbooking)
    // Serializable isolation ensures correct count reading
    return await db.transaction(
      async (tx) => {
        // 2a. Verify Room Existence & Capacity
        // Reads within transaction to ensure price/capacity consistency
        const room = await this.roomRepository.findById(data.roomId, tx);
        if (!room) {
          throw new NotFoundError('Room not found');
        }

        // Validate Guest Count vs Room Capacity
        if (data.adults > room.capacityAdults) {
          throw new BadRequestError(
            `Room capacity exceeded for adults. Max: ${room.capacityAdults}`
          );
        }
        if (data.children > room.capacityChildren) {
          throw new BadRequestError(
            `Room capacity exceeded for children. Max: ${room.capacityChildren}`
          );
        }

        // 2b. Check Availability (Count overlaps vs Capacity)
        // Passes 'tx' to ensure we read within transaction
        const currentBookingsCount =
          await this.bookingRepository.countOverlapping(
            data.roomId,
            data.checkIn,
            data.checkOut,
            tx
          );

        const roomCapacity = room.quantity || 1; // Default to 1 if undefined

        if (currentBookingsCount >= roomCapacity) {
          throw new BadRequestError(
            'Room is not available for the selected dates'
          );
        }

        // 2c. Calculate Total Price
        const nights = this.calculateNights(checkInDate, checkOutDate);
        if (nights === 0) {
          throw new BadRequestError('Invalid booking duration');
        }
        const pricePerNight = parseFloat(room.price);
        const totalPrice = (pricePerNight * nights).toFixed(2);

        // 2d. Create Booking
        const newBooking = await this.bookingRepository.create(
          {
            userId,
            hotelId: room.hotelId,
            roomId: data.roomId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            adults: data.adults,
            children: data.children,
            totalPrice,
            guestName: data.guestName,
            guestEmail: data.guestEmail,
            specialRequests: data.specialRequests,
            status: 'PENDING',
            paymentStatus: 'PENDING',
          },
          tx
        );

        return newBooking;
      },
      {
        isolationLevel: 'serializable',
        accessMode: 'read write',
      }
    );
  }

  /**
   * List my bookings (Guest) with Pagination
   */
  async listMyBookings(
    userId: string,
    options?: { page?: number; limit?: number }
  ) {
    return await this.bookingRepository.findByUserId(userId, options);
  }

  /**
   * List bookings for my hotels (Owner) with Pagination
   */
  async listHotelBookings(
    userId: string,
    options?: { page?: number; limit?: number }
  ) {
    // Efficiently fetch all bookings for owned hotels via Join query
    return await this.bookingRepository.findByOwnerId(userId, options);
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, userId: string) {
    // 1. Find booking
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // 2. Verify Permission
    const isGuest = booking.userId === userId;
    // Assuming Relation is populated
    const isOwner = booking.hotel && booking.hotel.ownerId === userId;

    if (!isGuest && !isOwner) {
      throw new ForbiddenError('You are not authorized to cancel this booking');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestError('Booking is already cancelled');
    }

    // 3. Update Status
    const cancelledBooking = await this.bookingRepository.updateStatus(
      bookingId,
      'CANCELLED'
    );

    return cancelledBooking;
  }

  /**
   * Update booking status (Host only)
   */
  async updateBookingStatus(
    bookingId: string,
    userId: string,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  ) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Verify Ownership
    const isOwner = booking.hotel && booking.hotel.ownerId === userId;
    // TODO: Add Admin check if we pass user Role to service
    if (!isOwner) {
      throw new ForbiddenError(
        'You are not authorized to update this booking status'
      );
    }

    return await this.bookingRepository.updateBookingStatus(bookingId, status);
  }

  /**
   * Update payment status (Host only)
   */
  async updatePaymentStatus(
    bookingId: string,
    userId: string,
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  ) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Verify Ownership
    const isOwner = booking.hotel && booking.hotel.ownerId === userId;
    if (!isOwner) {
      throw new ForbiddenError(
        'You are not authorized to update this payment status'
      );
    }

    return await this.bookingRepository.updatePaymentStatus(
      bookingId,
      paymentStatus
    );
  }
}
