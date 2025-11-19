import { bookingStatusEnum } from '@koredeycode/lendly-types';
import { Booking } from './booking.entity';

export abstract class BookingRepository {
  abstract createBooking(borrowerId: string, data: Booking): Promise<Booking>;
  abstract findBookingById(id: string): Promise<Booking | null>;
  abstract getBookingsForUser(userId, type: string): Promise<Booking[]>;
  abstract acceptBooking(bookingId: string, tipCents: number);
  abstract updateBookingStatus(
    bookingId: string,
    status: (typeof bookingStatusEnum.enumValues)[number],
  );
}
