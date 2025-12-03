import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import { items, users } from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import { CreateItemDTO } from '../application/dto/create-item.dto';
import { SearchItemsDTO } from '../application/dto/search-items.dto';
import { UpdateItemDTO } from '../application/dto/update-item.dto';
import { ItemRepository } from '../domain/item.repository';

@Injectable()
export class DrizzleItemRepository implements ItemRepository {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createItem(ownerId: string, data: CreateItemDTO) {
    const { location, ...rest } = data;
    // const locationSql = sql`POINT(${location[0]}, ${location[1]})`;
    // const locationSql = sql`ST_Point(${location[0]}, ${location[0]})::geography`;
    const [item] = await this.db
      .insert(items)
      .values({
        ...rest,
        location,
        ownerId,
        category: rest.category as any,
      })
      .returning();
    return item;
  }

  async findItemById(id: string) {
    const result = await this.db
      .select({
        ...getTableColumns(items),
        owner: {
          id: users.id,
          name: users.name,
          trustScore: users.trustScore,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(items)
      .innerJoin(users, eq(items.ownerId, users.id))
      .where(eq(items.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async findItemsByOwner(ownerId: string, includeDeleted = false) {
    return await this.db
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
  }: SearchItemsDTO) {
    const offset = (page - 1) * limit;

    const itemList = await this.db
      //   {
      //   item: items,
      //   distance: sql<number>`ST_Distance(
      //   ${items.location},
      //   ST_Point(${lng}, ${lat})::geography
      // ) / 1000`,
      // }
      .select({
        ...getTableColumns(items),
        owner: {
          id: users.id,
          name: users.name,
          trustScore: users.trustScore,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(items)
      .innerJoin(users, eq(items.ownerId, users.id))
      .where(
        and(
          isNull(items.deletedAt),
          onlyAvailable ? eq(items.isAvailable, true) : undefined,
          onlyFree ? eq(items.dailyRentalPriceCents, 0) : undefined,
          category ? eq(items.category, category as any) : undefined,
          search
            ? sql`to_tsvector('english', ${items.title} || ' ' || ${items.description}) @@ plainto_tsquery('english', ${search})`
            : undefined,
          lat && lng
            ? sql`ST_DWithin(
          ${items.location},
          ST_Point(${lng}, ${lat})::geography,
          ${radiusKm * 1000}
        )`
            : undefined,
        ),
      )
      // .orderBy(sql`distance`)
      .limit(limit)
      .offset(offset);

    return itemList;
  }

  async updateItem(id: string, data: UpdateItemDTO, tx?: any) {
    const database = tx || this.db;
    const updatedData = { ...data, updatedAt: new Date() };

    // if (data.location) {
    //   // updatedData.location = sql`ST_Point(${data.location.lng}, ${data.location.lat})::geography`;
    //   // updatedData.location = sql`POINT(${data.location.lng}, ${data.location.lat})`;
    //   const location = [data.location.lat, data.location.lng] as [
    //     number,
    //     number,
    //   ];
    // }
    const [item] = await database
      .update(items)
      .set({ ...updatedData, category: updatedData.category as any })
      .where(eq(items.id, id))
      .returning();
    return item;
  }

  async softDeleteItem(id: string) {
    const [item] = await this.db
      .update(items)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return item;
  }
}
