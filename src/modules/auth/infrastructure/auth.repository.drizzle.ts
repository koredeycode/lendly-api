import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../../config/db/drizzle/client';
import { users } from '../../../config/db/schema';
import { AuthUser } from '../domain/auth.entity';
import { AuthRepository } from '../domain/auth.repository';

@Injectable()
export class DrizzleAuthRepository implements AuthRepository {
  async findByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0] ?? null;

    if (!user) return null;
    return new AuthUser(user.id, user.name, user.email, user.passwordHash);
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const user = result[0] ?? null;

    if (!user) return null;
    return new AuthUser(user.id, user.name, user.email);
  }
  async createUser(user: AuthUser) {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
    });
    return user;
  }

  async createGoogleUser(data: AuthUser) {
    const [newUser] = await db.insert(users).values(data).returning();

    return newUser;
  }
}
