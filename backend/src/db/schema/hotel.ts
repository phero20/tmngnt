import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  decimal,
  primaryKey,
  uniqueIndex,
  index,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth';

// --------------------------------------------------------------------------
// 🏨 Hotel Table
// --------------------------------------------------------------------------
export const hotel = pgTable(
  'hotel',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: text('ownerId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }), // Links to Auth User

    // Basic Info
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(), // e.g. "grand-hyatt-mumbai"
    description: text('description'),

    // Location (Crucial for Search)
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state'),
    country: text('country').notNull(),
    zipCode: text('zipCode'),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),

    // Contact & Rules
    contactPhone: text('contactPhone'),
    contactEmail: text('contactEmail'),
    checkInTime: text('checkInTime').default('14:00'), // 24hr format
    checkOutTime: text('checkOutTime').default('11:00'),

    // Status & Metadata
    isActive: boolean('isActive').default(true).notNull(),
    starRating: integer('starRating').default(0), // 1-5

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      cityIdx: index('hotel_city_idx').on(table.city),
      slugIdx: uniqueIndex('hotel_slug_idx').on(table.slug),
      ownerIdx: index('hotel_owner_idx').on(table.ownerId),
    };
  }
);

// --------------------------------------------------------------------------
// 🛏️ Room Table
// --------------------------------------------------------------------------
export const room = pgTable(
  'room',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    hotelId: uuid('hotelId')
      .notNull()
      .references(() => hotel.id, { onDelete: 'cascade' }),

    name: text('name').notNull(), // e.g. "Ocean View Suite"
    description: text('description'),

    // Pricing & Inventory
    price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Standard Nightly Rate
    capacityAdults: integer('capacityAdults').default(2).notNull(),
    capacityChildren: integer('capacityChildren').default(0).notNull(),
    quantity: integer('quantity').default(1).notNull(), // Total number of rooms of this type
    sizeSqFt: integer('sizeSqFt'),

    isActive: boolean('isActive').default(true).notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      hotelIdx: index('room_hotel_idx').on(table.hotelId),
    };
  }
);

// --------------------------------------------------------------------------
// ✨ Amenity Table (Master List)
// --------------------------------------------------------------------------
export const amenity = pgTable('amenity', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(), // e.g. "Free WiFi", "Swimming Pool"
  icon: text('icon'), // Identifier for frontend icon lib (e.g. "wifi", "pool")
  category: text('category').default('GENERAL'), // GENERAL, ROOM, OUTDOOR
});

// --------------------------------------------------------------------------
// 🔗 Hotel <-> Amenity (Many-to-Many)
// --------------------------------------------------------------------------
export const hotelAmenity = pgTable(
  'hotel_amenity',
  {
    hotelId: uuid('hotelId')
      .notNull()
      .references(() => hotel.id, { onDelete: 'cascade' }),
    amenityId: uuid('amenityId')
      .notNull()
      .references(() => amenity.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.hotelId, table.amenityId] }),
    };
  }
);

// --------------------------------------------------------------------------
// 🖼️ Hotel Images (Gallery)
// --------------------------------------------------------------------------
export const hotelImage = pgTable(
  'hotel_image',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    hotelId: uuid('hotelId')
      .notNull()
      .references(() => hotel.id, { onDelete: 'cascade' }),
    roomId: uuid('roomId').references(() => room.id, { onDelete: 'set null' }), // Optional: Link to specific room type

    url: text('url').notNull(),
    altText: text('altText'),
    isPrimary: boolean('isPrimary').default(false),
    order: integer('order').default(0),

    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => {
    return {
      hotelIdx: index('image_hotel_idx').on(table.hotelId),
    };
  }
);

// --------------------------------------------------------------------------
// 📅 Room Inventory (Availability Tracking)
// --------------------------------------------------------------------------
export const roomInventory = pgTable(
  'room_inventory',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roomId: uuid('roomId')
      .notNull()
      .references(() => room.id, { onDelete: 'cascade' }),
    date: date('date').notNull(), // YYYY-MM-DD
    totalRooms: integer('totalRooms').notNull(), // Snapshot of total capacity
    bookedCount: integer('bookedCount').default(0).notNull(),
  },
  (table) => {
    return {
      roomDateIdx: uniqueIndex('room_inventory_date_idx').on(
        table.roomId,
        table.date
      ),
    };
  }
);

// --------------------------------------------------------------------------
// 🔗 Room <-> Amenity (Granular Features)
// --------------------------------------------------------------------------
export const roomAmenity = pgTable(
  'room_amenity',
  {
    roomId: uuid('roomId')
      .notNull()
      .references(() => room.id, { onDelete: 'cascade' }),
    amenityId: uuid('amenityId')
      .notNull()
      .references(() => amenity.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roomId, table.amenityId] }),
    };
  }
);

// --------------------------------------------------------------------------
// 🤝 Relationships (Drizzle ORM)
// --------------------------------------------------------------------------

export const hotelRelations = relations(hotel, ({ one, many }) => ({
  owner: one(user, {
    fields: [hotel.ownerId],
    references: [user.id],
  }),
  rooms: many(room),
  images: many(hotelImage),
  amenities: many(hotelAmenity),
}));

export const roomRelations = relations(room, ({ one, many }) => ({
  hotel: one(hotel, {
    fields: [room.hotelId],
    references: [hotel.id],
  }),
  images: many(hotelImage),
  inventory: many(roomInventory),
  amenities: many(roomAmenity),
}));

export const amenityRelations = relations(amenity, ({ many }) => ({
  hotels: many(hotelAmenity),
  rooms: many(roomAmenity),
}));

export const hotelAmenityRelations = relations(hotelAmenity, ({ one }) => ({
  hotel: one(hotel, {
    fields: [hotelAmenity.hotelId],
    references: [hotel.id],
  }),
  amenity: one(amenity, {
    fields: [hotelAmenity.amenityId],
    references: [amenity.id],
  }),
}));

export const hotelImageRelations = relations(hotelImage, ({ one }) => ({
  hotel: one(hotel, {
    fields: [hotelImage.hotelId],
    references: [hotel.id],
  }),
  room: one(room, {
    fields: [hotelImage.roomId],
    references: [room.id],
  }),
}));

export const roomInventoryRelations = relations(roomInventory, ({ one }) => ({
  room: one(room, {
    fields: [roomInventory.roomId],
    references: [room.id],
  }),
}));

export const roomAmenityRelations = relations(roomAmenity, ({ one }) => ({
  room: one(room, {
    fields: [roomAmenity.roomId],
    references: [room.id],
  }),
  amenity: one(amenity, {
    fields: [roomAmenity.amenityId],
    references: [amenity.id],
  }),
}));

// --------------------------------------------------------------------------
// 🔄 User Relations (Defined here to avoid circular dependency in auth.ts)
// --------------------------------------------------------------------------
export const userRelations = relations(user, ({ many }) => ({
  hotels: many(hotel),
}));
