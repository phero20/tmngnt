import {
  pgTable,
  text,
  timestamp,
  uuid,
  decimal,
  date,
  pgEnum,
  index,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth';
import { hotel, room } from './hotel';

// --------------------------------------------------------------------------
// 📅 Booking Enums
// --------------------------------------------------------------------------
export const bookingStatusEnum = pgEnum('booking_status', [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
]);

// --------------------------------------------------------------------------
// 📝 Booking Table
// --------------------------------------------------------------------------
export const booking = pgTable(
  'booking',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // Foreign Keys
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    hotelId: uuid('hotelId')
      .notNull()
      .references(() => hotel.id, { onDelete: 'cascade' }),
    roomId: uuid('roomId')
      .notNull()
      .references(() => room.id, { onDelete: 'cascade' }),

    // Dates
    checkIn: date('checkIn').notNull(),
    checkOut: date('checkOut').notNull(),

    // Financials
    totalPrice: decimal('totalPrice', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').default('USD').notNull(),

    // Status
    status: bookingStatusEnum('status').default('PENDING').notNull(),
    paymentStatus: paymentStatusEnum('paymentStatus')
      .default('PENDING')
      .notNull(),

    // Guest Details
    adults: integer('adults').default(1).notNull(),
    children: integer('children').default(0).notNull(),

    // Metadata
    guestName: text('guestName'), // Optional: if booking for someone else
    guestEmail: text('guestEmail'),
    specialRequests: text('specialRequests'),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdx: index('booking_user_idx').on(table.userId),
      hotelIdx: index('booking_hotel_idx').on(table.hotelId),
      roomIdx: index('booking_room_idx').on(table.roomId),
      checkInIdx: index('booking_check_in_idx').on(table.checkIn),
    };
  }
);

// --------------------------------------------------------------------------
// 🤝 Relationships
// --------------------------------------------------------------------------
export const bookingRelations = relations(booking, ({ one }) => ({
  user: one(user, {
    fields: [booking.userId],
    references: [user.id],
  }),
  hotel: one(hotel, {
    fields: [booking.hotelId],
    references: [hotel.id],
  }),
  room: one(room, {
    fields: [booking.roomId],
    references: [room.id],
  }),
}));
