import { db } from '../db';
import { user, session, account } from '../db/schema/auth';
import { eq } from 'drizzle-orm';
// import { User } from '../db/schema/auth'; // Type not exported explicitly

export class AuthRepository {
  async updateUser(userId: string, data: Partial<typeof user.$inferSelect>) {
    const [updatedUser] = await db
      .update(user)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();
    return updatedUser;
  }

  async deleteUser(userId: string) {
    // Delete related records first to avoid FK constraints
    // Note: Transactions are not supported by neon-http driver, so we execute sequentially.
    await db.delete(session).where(eq(session.userId, userId));
    await db.delete(account).where(eq(account.userId, userId));
    // Hotel records delete automatically due to CASCADE in schema
    return await db.delete(user).where(eq(user.id, userId));
  }
}
