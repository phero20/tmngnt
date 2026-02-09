import { db } from '../db';
import { amenity } from '../db/schema/hotel';
import { eq } from 'drizzle-orm';

export class AmenityRepository {
  async create(data: { name: string; category?: string; icon?: string }) {
    const [newAmenity] = await db.insert(amenity).values(data).returning();
    return newAmenity;
  }

  async findAll() {
    return await db.query.amenity.findMany();
  }

  async findById(id: string) {
    return await db.query.amenity.findFirst({
      where: eq(amenity.id, id),
    });
  }

  async update(
    id: string,
    data: Partial<{ name: string; category: string; icon: string }>
  ) {
    const [updatedAmenity] = await db
      .update(amenity)
      .set(data)
      .where(eq(amenity.id, id))
      .returning();
    return updatedAmenity;
  }

  async delete(id: string) {
    const [deletedAmenity] = await db
      .delete(amenity)
      .where(eq(amenity.id, id))
      .returning();
    return deletedAmenity;
  }
}
