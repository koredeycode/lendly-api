import { Injectable } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { Booking, bookings, bookingStatusEnum, items } from 'src/config/db/schema';
import { CreateBookingDTO } from '../application/dto/create-booking.dto';

import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class DrizzleBookingRepository implements BookingRepository {
  async createBooking(
    itemId: string,
    borrowerId: string,
    data: CreateBookingDTO,
  ) {
    const [booking] = await db
      .insert(bookings)
      .values({
        itemId,
        ...data,
        requestedFrom: new Date(data.requestedFrom),
        requestedTo: new Date(data.requestedTo),
        borrowerId,
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

    const booking = result[0] ?? null;

    if (!booking) return null;

    return booking;
  }

  async getBookingsForUser(userId: string, type: 'lending' | 'borrowing') {
    let userBookings;
    if (type === 'lending') {
      userBookings = await db
        .select({ booking: bookings, item: items })
        .from(bookings)
        .innerJoin(items, eq(bookings.itemId, items.id))
        .where(eq(items.ownerId, userId))
        .orderBy(desc(bookings.createdAt));
      return userBookings as Booking[];
    }

    userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.borrowerId, userId))
      .orderBy(desc(bookings.createdAt));
    return userBookings as Booking[];
  }

  async deleteBooking(id: string) {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  async acceptBooking(bookingId: string, tipCents = 0) {
    const [updated] = await db
      .update(bookings)
      .set({
        status: 'accepted',
        thankYouTipCents: tipCents,
        totalChargedCents: sql`${bookings.rentalFeeCents} + ${tipCents}`,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return updated;
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
}
