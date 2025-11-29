import { Injectable } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { bookings, bookingStatusEnum } from 'src/config/db/schema';
import { CreateBookingDTO } from '../application/dto/create-booking.dto';

import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class DrizzleBookingRepository implements BookingRepository {
  async createBooking(
    itemId: string,
    borrowerId: string,
    data: CreateBookingDTO,
    tx?: any,
  ) {
    const database = tx || db;
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
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async getBookingsForUser(userId: string, type: 'borrower' | 'owner') {
    if (type === 'borrower') {
      return await db
        .select()
        .from(bookings)
        .where(eq(bookings.borrowerId, userId))
        .orderBy(desc(bookings.createdAt));
    } else {
      // Join with items to find bookings for items owned by user
      // For now, let's assume we fetch items first or do a join
      // Simplified:
      return []; // TODO: implement owner bookings
    }
  }

  async deleteBooking(id: string) {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  async acceptBooking(id: string, tipAmount = 0, tx?: any) {
    const database = tx || db;
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
    const [booking] = await db
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
    const query = db
      .select()
      .from(bookings)
      .where(eq(bookings.itemId, itemId))
      .orderBy(desc(bookings.createdAt));

    if (status) {
      // If status is provided, we filter by it.
      // However, drizzle's where clause needs to be composed differently if we want to add conditions dynamically.
      // Let's rewrite this slightly.
      return await db
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

  async checkAvailability(itemId: string, from: Date, to: Date) {
    // Check if there are any overlapping bookings that are accepted or picked_up
    // Overlap logic: (StartA <= EndB) and (EndA >= StartB)
    const [result] = await db
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
}
