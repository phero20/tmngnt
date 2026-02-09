import { db } from '../db';
import { room, hotelImage, roomAmenity, roomInventory } from '../db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export class RoomRepository {
  async create(
    data: typeof room.$inferInsert & {
      amenityIds?: string[];
      images?: string[];
    }
  ) {
    return await db.transaction(async (tx) => {
      const { amenityIds, images, ...roomData } = data;
      const [newRoom] = await tx.insert(room).values(roomData).returning();

      // Add Room Amenities
      if (amenityIds && amenityIds.length > 0) {
        const values = amenityIds.map((amenityId) => ({
          roomId: newRoom.id,
          amenityId,
        }));
        await tx.insert(roomAmenity).values(values);
      }

      // Add Room Images
      if (images && images.length > 0) {
        const values = images.map((url, idx) => ({
          hotelId: newRoom.hotelId, // Must link to parent hotel too
          roomId: newRoom.id,
          url,
          order: idx,
        }));
        await tx.insert(hotelImage).values(values);
      }

      return newRoom;
    });
  }

  async findById(id: string) {
    return await db.query.room.findFirst({
      where: and(eq(room.id, id), sql`${room.deletedAt} IS NULL`),
      with: {
        images: true,
        amenities: {
          with: {
            amenity: true,
          },
        },
        inventory: true,
      },
    });
  }

  async findAllByHotelId(hotelId: string) {
    return await db.query.room.findMany({
      where: and(eq(room.hotelId, hotelId), sql`${room.deletedAt} IS NULL`),
      with: {
        images: {
          limit: 1,
        },
        amenities: {
          with: {
            amenity: true,
          },
        },
      },
      orderBy: [desc(room.createdAt)],
    });
  }

  async update(id: string, data: Partial<typeof room.$inferInsert>) {
    const [updatedRoom] = await db
      .update(room)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(room.id, id))
      .returning();
    return updatedRoom;
  }

  async delete(id: string) {
    const [deletedRoom] = await db
      .update(room)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(room.id, id))
      .returning();
    return deletedRoom;
  }

  // --- Inventory Management ---
  async updateInventory(roomId: string, date: string, totalRooms: number) {
    // Upsert logic for inventory
    // If PostgreSQL, use .onConflictDoUpdate()

    return await db
      .insert(roomInventory)
      .values({
        roomId,
        date,
        totalRooms,
      })
      .onConflictDoUpdate({
        target: [roomInventory.roomId, roomInventory.date],
        set: { totalRooms },
      })
      .returning();
  }
}
