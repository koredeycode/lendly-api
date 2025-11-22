import { Injectable } from '@nestjs/common';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { items } from 'src/config/db/schema';
import { CreateItemDTO } from '../application/dto/create-item.dto';
import { UpdateItemDTO } from '../application/dto/update-item.dto';
import { ItemRepository } from '../domain/item.repository';

@Injectable()
export class DrizzleItemRepository implements ItemRepository {
  async createItem(ownerId: string, data: CreateItemDTO) {
    const { location, ...rest } = data;
    // const locationSql = sql`POINT(${location[0]}, ${location[1]})`;
    // const locationSql = sql`ST_Point(${location[0]}, ${location[0]})::geography`;
    const [item] = await db
      .insert(items)
      .values({
        ...rest,
        location,
        ownerId,
      })
      .returning();
    return item;
  }

  async findItemById(id: string) {
    const result = await db
      .select()
      .from(items)
      .where(eq(items.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async findItemsByOwner(ownerId: string, includeDeleted = false) {
    return await db
      .select()
      .from(items)
      .where(
        and(
          eq(items.ownerId, ownerId),
          includeDeleted ? undefined : isNull(items.deletedAt),
        ),
      )
      .orderBy(desc(items.createdAt));
  }

  async searchItems({
    lat,
    lng,
    radiusKm = 10,
    category,
    onlyAvailable = true,
    onlyFree = false,
    search,
    page = 1,
    limit = 20,
  }: {
    lat: number;
    lng: number;
    radiusKm?: number;
    category?: string;
    onlyAvailable?: boolean;
    onlyFree?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const offset = (page - 1) * limit;

    return await db
      .select({
        item: items,
        distance: sql<number>`ST_Distance(
        ${items.location},
        ST_Point(${lng}, ${lat})::geography
      ) / 1000`,
      })
      .from(items)
      .where(
        and(
          isNull(items.deletedAt),
          onlyAvailable ? eq(items.isAvailable, true) : undefined,
          onlyFree ? eq(items.dailyRentalPriceCents, 0) : undefined,
          category ? eq(items.category, category) : undefined,
          search
            ? sql`to_tsvector('english', ${items.title} || ' ' || ${items.description}) @@ plainto_tsquery('english', ${search})`
            : undefined,
          sql`ST_DWithin(
          ${items.location},
          ST_Point(${lng}, ${lat})::geography,
          ${radiusKm * 1000}
        )`,
        ),
      )
      .orderBy(sql`distance`)
      .limit(limit)
      .offset(offset);
  }

  async updateItem(id: string, data: UpdateItemDTO) {
    const updatedData = { ...data, updatedAt: new Date() };

    // if (data.location) {
    //   // updatedData.location = sql`ST_Point(${data.location.lng}, ${data.location.lat})::geography`;
    //   // updatedData.location = sql`POINT(${data.location.lng}, ${data.location.lat})`;
    //   const location = [data.location.lat, data.location.lng] as [
    //     number,
    //     number,
    //   ];
    // }
    const [item] = await db
      .update(items)
      .set({ ...updatedData })
      .where(eq(items.id, id))
      .returning();
    return item;
  }

  async softDeleteItem(id: string) {
    const [item] = await db
      .update(items)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return item;
  }
}
