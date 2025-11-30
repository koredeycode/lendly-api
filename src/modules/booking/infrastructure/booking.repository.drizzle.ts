import { Inject, Injectable } from '@nestjs/common';
import { aliasedTable, desc, eq, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import { bookings, bookingStatusEnum, chatMessages, items, users } from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import { CreateBookingDTO } from '../application/dto/create-booking.dto';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class DrizzleBookingRepository implements BookingRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async createBooking(
    itemId: string,
    borrowerId: string,
    data: CreateBookingDTO,
    tx?: any,
  ) {
    const database = tx || this.db;
    const [booking] = await database
      .insert(bookings)
      .values({
        itemId,
        borrowerId,
        ...data,
        status: 'pending',
        totalChargedCents: data.rentalFeeCents + (data.thankYouTipCents || 0),
      })
      .returning();
    return booking;
  }

  async findBookingById(id: string) {
    const owner = aliasedTable(users, 'owner');
    const borrower = aliasedTable(users, 'borrower');

    const result = await this.db
      .select({
        booking: bookings,
        item: items,
        owner: owner,
        borrower: borrower,
      })
      .from(bookings)
      .innerJoin(items, eq(bookings.itemId, items.id))
      .innerJoin(owner, eq(items.ownerId, owner.id))
      .innerJoin(borrower, eq(bookings.borrowerId, borrower.id))
      .where(eq(bookings.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];
    return {
      ...row.booking,
      item: {
        ...row.item,
        owner: row.owner,
      },
      borrower: row.borrower,
    };
  }

  async getBookingsForUser(userId: string, type?: 'borrower' | 'owner') {
    const owner = aliasedTable(users, 'owner');
    const borrower = aliasedTable(users, 'borrower');

    const query = this.db
      .select({
        booking: bookings,
        item: items,
        owner: owner,
        borrower: borrower,
      })
      .from(bookings)
      .innerJoin(items, eq(bookings.itemId, items.id))
      .innerJoin(owner, eq(items.ownerId, owner.id))
      .innerJoin(borrower, eq(bookings.borrowerId, borrower.id))
      .orderBy(desc(bookings.createdAt));

    if (type === 'borrower') {
      query.where(eq(bookings.borrowerId, userId));
    } else if (type === 'owner') {
      query.where(eq(items.ownerId, userId));
    } else {
      query.where(
        or(eq(bookings.borrowerId, userId), eq(items.ownerId, userId)),
      );
    }

    const result = await query;

    return result.map((row) => ({
      ...row.booking,
      item: {
        ...row.item,
        owner: row.owner,
      },
      borrower: row.borrower,
    }));
  }

  async deleteBooking(id: string) {
    await this.db.delete(bookings).where(eq(bookings.id, id));
  }

  async acceptBooking(id: string, tipAmount = 0, tx?: any) {
    const database = tx || this.db;
    const [booking] = await database
      .update(bookings)
      .set({
        status: 'accepted',
        thankYouTipCents: tipAmount,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    return booking;
  }

  async updateBookingStatus(
    bookingId: string,
    status: (typeof bookingStatusEnum.enumValues)[number],
  ) {
    const [booking] = await this.db
      .update(bookings)
      .set({
        status,
        ...(status === 'returned' ? { actualReturnedAt: new Date() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();
    return booking;
  }
  async findBookingsByItem(itemId: string, status?: any) {
    const query = this.db
      .select()
      .from(bookings)
      .where(eq(bookings.itemId, itemId))
      .orderBy(desc(bookings.createdAt));

    if (status) {
      // If status is provided, we filter by it.
      // However, drizzle's where clause needs to be composed differently if we want to add conditions dynamically.
      // Let's rewrite this slightly.
      return await this.db
        .select()
        .from(bookings)
        .where(
          status
            ? sql`${bookings.itemId} = ${itemId} AND ${bookings.status} = ${status}`
            : eq(bookings.itemId, itemId),
        )
        .orderBy(desc(bookings.createdAt));
    }

    return await query;
  }

  async checkAvailability(itemId: string, from: Date, to: Date, tx?: any) {
    const database = tx || this.db;
    // Check if there are any overlapping bookings that are accepted or picked_up
    // Overlap logic: (StartA <= EndB) and (EndA >= StartB)
    const [result] = await database
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(
        sql`
          ${bookings.itemId} = ${itemId}
          AND ${bookings.status} IN ('accepted', 'picked_up')
          AND tstzrange(${bookings.requestedFrom}, ${bookings.requestedTo}, '[)') && tstzrange(${from}, ${to}, '[)')
        `,
      );

    return result.count === 0;
  }

  async createChatMessage(
    bookingId: string,
    senderId: string,
    message: string,
    tx?: any,
  ) {
    const database = tx || this.db;
    await database.insert(chatMessages).values({
      bookingId,
      senderId,
      message,
      isRead: false,
    });
  }
}
