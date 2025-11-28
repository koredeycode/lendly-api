import { Booking, bookingStatusEnum } from 'src/config/db/schema';
import { CreateBookingDTO } from '../application/dto/create-booking.dto';

export abstract class BookingRepository {
  abstract createBooking(
    itemId: string,
    borrowerId: string,
    data: CreateBookingDTO,
  ): Promise<Booking>;
  abstract findBookingById(id: string): Promise<Booking | null>;
  abstract getBookingsForUser(userId, type: string): Promise<Booking[]>;
  abstract acceptBooking(bookingId: string, tipCents: number): Promise<Booking>;
  abstract updateBookingStatus(
    bookingId: string,
    status: (typeof bookingStatusEnum.enumValues)[number],
  ): Promise<Booking>;
  abstract deleteBooking(id: string): Promise<void>;
}
