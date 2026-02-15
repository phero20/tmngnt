import { db } from '../db';
import { hotel, hotelImage, hotelAmenity } from '../db/schema';
import { eq, and, like, desc, sql } from 'drizzle-orm';

export class HotelRepository {
  async create(
    data: typeof hotel.$inferInsert & {
      amenityIds?: string[];
      images?: string[];
    }
  ) {
    return await db.transaction(async (tx) => {
      // 1. Create Hotel
      const { amenityIds, images, ...hotelData } = data;
      const [newHotel] = await tx.insert(hotel).values(hotelData).returning();

      // 2. Add Amenities
      if (amenityIds && amenityIds.length > 0) {
        const amenityValues = amenityIds.map((id) => ({
          hotelId: newHotel.id,
          amenityId: id,
        }));
        await tx.insert(hotelAmenity).values(amenityValues);
      }

      // 3. Add Images
      if (images && images.length > 0) {
        const imageValues = images.map((url, idx) => ({
          hotelId: newHotel.id,
          url,
          order: idx,
          isPrimary: idx === 0, // First image is primary
        }));
        await tx.insert(hotelImage).values(imageValues);
      }

      return newHotel;
    });
  }

  async addImages(hotelId: string, imageUrls: string[]) {
    if (imageUrls.length === 0) return;
    const values = imageUrls.map((url, idx) => ({
      hotelId,
      url,
      order: idx,
    }));
    await db.insert(hotelImage).values(values);
  }

  async findById(id: string, includeArchived = false) {
    const whereCondition = includeArchived
      ? eq(hotel.id, id)
      : and(eq(hotel.id, id), sql`${hotel.deletedAt} IS NULL`);

    return await db.query.hotel.findFirst({
      where: whereCondition,
      with: {
        rooms: true,
        images: true,
        amenities: {
          with: {
            amenity: true,
          },
        },
        owner: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return await db.query.hotel.findFirst({
      where: and(eq(hotel.slug, slug), sql`${hotel.deletedAt} IS NULL`),
      with: {
        rooms: true,
        images: true,
        amenities: {
          with: {
            amenity: true,
          },
        },
      },
    });
  }

  async findAll(filters?: {
    city?: string;
    search?: string;
    limit?: number;
    offset?: number;
    ownerId?: string;
    archived?: boolean;
  }) {
    const limit = filters?.limit || 10;
    const offset = filters?.offset || 0;

    const whereConditions = [];

    if (filters?.city) {
      whereConditions.push(eq(hotel.city, filters.city));
    }

    if (filters?.search) {
      whereConditions.push(like(hotel.name, `%${filters.search}%`));
    }

    if (filters?.ownerId) {
      whereConditions.push(eq(hotel.ownerId, filters.ownerId));
    }

    if (filters?.archived) {
      whereConditions.push(sql`${hotel.deletedAt} IS NOT NULL`);
    } else {
      whereConditions.push(sql`${hotel.deletedAt} IS NULL`);
    }

    const hotels = await db.query.hotel.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      limit,
      offset,
      with: {
        images: {
          limit: 1, // Preview image
        },
      },
      orderBy: [desc(hotel.createdAt)],
    });

    return hotels;
  }

  async update(id: string, data: Partial<typeof hotel.$inferInsert>) {
    const [updatedHotel] = await db
      .update(hotel)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(hotel.id, id))
      .returning();
    return updatedHotel;
  }

  async delete(id: string) {
    // Soft Delete
    const [deletedHotel] = await db
      .update(hotel)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(hotel.id, id))
      .returning();
    return deletedHotel;
  }

  async restore(id: string) {
    const [restoredHotel] = await db
      .update(hotel)
      .set({ deletedAt: null, isActive: true })
      .where(eq(hotel.id, id))
      .returning();
    return restoredHotel;
  }

  // --- Amenities ---
  async setAmenities(hotelId: string, amenityIds: string[]) {
    // Clear existing first (simple approach) or diff them
    await db.delete(hotelAmenity).where(eq(hotelAmenity.hotelId, hotelId));

    if (amenityIds.length === 0) return;

    const values = amenityIds.map((id) => ({
      hotelId,
      amenityId: id,
    }));
    await db.insert(hotelAmenity).values(values);
  }
  async findByOwnerId(ownerId: string) {
    return await db.query.hotel.findMany({
      where: and(eq(hotel.ownerId, ownerId), sql`${hotel.deletedAt} IS NULL`),
      columns: {
        id: true,
        name: true,
      },
    });
  }
}
