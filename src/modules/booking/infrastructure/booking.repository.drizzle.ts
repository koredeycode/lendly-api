import { bookingStatusEnum } from '@koredeycode/lendly-types';
import { Injectable } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { bookings, items } from 'src/config/db/schema';
import { Booking } from '../domain/booking.entity';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class DrizzleBookingRepository implements BookingRepository {
  async createBooking(borrowerId: string, data: Booking) {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...data,
        borrowerId,
      })
      .returning();

    return booking as Booking;
  }

  async findBookingById(id: string) {
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);

    const booking = result[0] ?? null;

    if (!booking) return null;

    return booking as Booking;
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
