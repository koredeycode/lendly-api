import { Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { db } from 'src/config/db/drizzle/client';
import {
  deviceTokens,
  items,
  reports,
  savedItems,
  userLocations,
  users,
} from '../../../config/db/schema';
import {
  CreateGoogleUserDTO,
  CreateUserDTO,
} from '../application/dto/create-user.dto';
import { UpdateUserDTO } from '../application/dto/update-user.dto';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0] ?? null;

    if (!user) return null;
    return user;
  }

  async findUserById(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const user = result[0] ?? null;

    if (!user) return null;
    return user;
  }

  async createUser(user: CreateUserDTO, passwordHash: string) {
    const [newUser] = await db
      .insert(users)
      .values({
        // id: user.id,
        email: user.email,
        passwordHash,
        name: user.name,
      })
      .returning();
    return newUser;
  }

  async createGoogleUser(data: CreateGoogleUserDTO) {
    const [newUser] = await db.insert(users).values(data).returning();

    return newUser;
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUserLocation(userId: string, lat: number, lng: number) {
    return await db
      .insert(userLocations)
      .values({
        userId,
        location: sql`POINT(${lng}, ${lat})`,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userLocations.userId,
        set: {
          location: sql`POINT(${lng}, ${lat})`,
          updatedAt: new Date(),
        },
      });
  }

  async createReport(data: {
    reporterId: string;
    reportedUserId?: string;
    reportedItemId?: string;
    reason: string;
  }) {
    const [report] = await db.insert(reports).values(data).returning();
    return report;
  }

  async toggleSavedItem(userId: string, itemId: string) {
    return await db
      .insert(savedItems)
      .values({ userId, itemId })
      .onConflictDoNothing();
  }

  async unsaveItem(userId: string, itemId: string) {
    return await db
      .delete(savedItems)
      .where(and(eq(savedItems.userId, userId), eq(savedItems.itemId, itemId)));
  }

  async getSavedItems(userId: string) {
    return await db
      .select({ item: items })
      .from(savedItems)
      .innerJoin(items, eq(savedItems.itemId, items.id))
      .where(eq(savedItems.userId, userId));
  }

  async upsertDeviceToken(
    userId: string,
    token: string,
    platform: 'ios' | 'android' | 'web',
  ) {
    return await db
      .insert(deviceTokens)
      .values({ userId, token, platform })
      .onConflictDoUpdate({
        target: [deviceTokens.userId, deviceTokens.token],
        set: { platform, createdAt: new Date() },
      });
  }
}
