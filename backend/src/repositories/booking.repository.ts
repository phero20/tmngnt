import { db } from '../db';
import { booking } from '../db/schema';
import { eq, and, ne, lt, gt, desc } from 'drizzle-orm';

export class BookingRepository {
  /**
   * Create a new booking
   */
  async create(data: typeof booking.$inferInsert) {
    const [newBooking] = await db.insert(booking).values(data).returning();
    return newBooking;
  }

  /**
   * Check if a room is available for the given date range
   * Returns true if available, false if overlapping booking exists
   */
  async checkAvailability(
    roomId: string,
    checkIn: string, // YYYY-MM-DD
    checkOut: string // YYYY-MM-DD
  ): Promise<boolean> {
    // Overlap condition: (StartA < EndB) && (EndA > StartB)
    // We search for ANY booking that overlaps with the requested range
    // AND is not cancelled
    const overlappingBookings = await db
      .select({ id: booking.id })
      .from(booking)
      .where(
        and(
          eq(booking.roomId, roomId),
          ne(booking.status, 'CANCELLED'),
          // Existing Start < Request End
          lt(booking.checkIn, checkOut),
          // Existing End > Request Start
          gt(booking.checkOut, checkIn)
        )
      )
      .limit(1);

    return overlappingBookings.length === 0;
  }

  /**
   * Find booking by ID with full details
   */
  async findById(id: string) {
    return await db.query.booking.findFirst({
      where: eq(booking.id, id),
      with: {
        user: true,
        hotel: {
          with: {
            images: { limit: 1 },
          },
        },
        room: true,
      },
    });
  }

  /**
   * Find bookings by User ID (for guests)
   */
  async findByUserId(userId: string) {
    return await db.query.booking.findMany({
      where: eq(booking.userId, userId),
      with: {
        hotel: {
          columns: {
            name: true,
            city: true,
            slug: true,
          },
          with: {
            images: { limit: 1 },
          },
        },
        room: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: [desc(booking.createdAt)],
    });
  }

  /**
   * Find bookings by Hotel ID (for hotel owners)
   */
  async findByHotelId(hotelId: string) {
    return await db.query.booking.findMany({
      where: eq(booking.hotelId, hotelId),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
        room: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: [desc(booking.checkIn)],
    });
  }

  /**
   * Update booking status
   */
  async updateStatus(
    id: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
    paymentStatus?: 'PAID' | 'REFUNDED' | 'PENDING' | 'FAILED'
  ) {
    const updateData: Partial<typeof booking.$inferInsert> = {
      status,
      updatedAt: new Date(),
    };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const [updatedBooking] = await db
      .update(booking)
      .set(updateData)
      .where(eq(booking.id, id))
      .returning();

    return updatedBooking;
  }
}
