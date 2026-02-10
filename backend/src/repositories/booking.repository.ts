import { db } from '../db';
import { booking, hotel } from '../db/schema';
import { eq, and, ne, lt, gt, desc, sql } from 'drizzle-orm';

// Helper type for Transaction or DB instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbOrTx = any;

export class BookingRepository {
  /**
   * Create a new booking
   * Supports external transaction
   */
  async create(data: typeof booking.$inferInsert, tx: DbOrTx = db) {
    const [newBooking] = await tx.insert(booking).values(data).returning();
    return newBooking;
  }

  /**
   * Count overlapping bookings for a room in a given date range.
   * Used for checking against room quantity.
   */
  async countOverlapping(
    roomId: string,
    checkIn: string,
    checkOut: string,
    tx: DbOrTx = db
  ): Promise<number> {
    const result = await tx
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(booking)
      .where(
        and(
          eq(booking.roomId, roomId),
          ne(booking.status, 'CANCELLED'),
          // Overlap Condition: (StartA < EndB) && (EndA > StartB)
          lt(booking.checkIn, checkOut),
          gt(booking.checkOut, checkIn)
        )
      );

    return result[0].count;
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
   * Find bookings by User ID (for guests) with Pagination
   */
  async findByUserId(
    userId: string,
    options?: { page?: number; limit?: number }
  ) {
    const limit = options?.limit || 10;
    const offset = options?.page ? (options.page - 1) * limit : 0;

    return await db.query.booking.findMany({
      where: eq(booking.userId, userId),
      limit,
      offset,
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
   * Find bookings by Hotel ID (for hotel owners) with Pagination
   */
  async findByHotelId(
    hotelId: string,
    options?: { page?: number; limit?: number }
  ) {
    const limit = options?.limit || 10;
    const offset = options?.page ? (options.page - 1) * limit : 0;

    return await db.query.booking.findMany({
      where: eq(booking.hotelId, hotelId),
      limit,
      offset,
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
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
    paymentStatus?: 'PAID' | 'REFUNDED' | 'PENDING' | 'FAILED',
    tx: DbOrTx = db
  ) {
    const updateData: Partial<typeof booking.$inferInsert> = {
      status,
      updatedAt: new Date(),
    };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const [updatedBooking] = await tx
      .update(booking)
      .set(updateData)
      .where(eq(booking.id, id))
      .returning();

    return updatedBooking;
  }

  async updateBookingStatus(
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  ) {
    const [updatedBooking] = await db
      .update(booking)
      .set({ status, updatedAt: new Date() })
      .where(eq(booking.id, id))
      .returning();
    return updatedBooking;
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  ) {
    const [updatedBooking] = await db
      .update(booking)
      .set({ paymentStatus, updatedAt: new Date() })
      .where(eq(booking.id, id))
      .returning();
    return updatedBooking;
  }

  /**
   * Find all bookings for hotels owned by a specific user (Owner)
   * Supports Pagination
   */
  async findByOwnerId(
    ownerId: string,
    options?: { page?: number; limit?: number }
  ) {
    const limit = options?.limit || 10;
    const offset = options?.page ? (options.page - 1) * limit : 0;

    const result = await db
      .select()
      .from(booking)
      .innerJoin(hotel, eq(booking.hotelId, hotel.id))
      .where(eq(hotel.ownerId, ownerId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(booking.createdAt));

    return result.map((row) => ({
      ...row.booking,
      hotel: row.hotel,
    }));
  }
}
