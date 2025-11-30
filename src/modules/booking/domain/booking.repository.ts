import { Booking, bookingStatusEnum, Item, User } from 'src/config/db/schema';
import { CreateBookingDTO } from '../application/dto/create-booking.dto';

export type BookingWithDetails = Booking & {
  item: Item & { owner: User };
  borrower: User;
};

export abstract class BookingRepository {
  abstract createBooking(
    itemId: string,
    borrowerId: string,
    data: CreateBookingDTO,
    tx?: any,
  ): Promise<Booking>;
  abstract findBookingById(id: string): Promise<BookingWithDetails | null>;
  abstract getBookingsForUser(
    userId: string,
    type?: string,
  ): Promise<BookingWithDetails[]>;
  abstract acceptBooking(
    id: string,
    tipAmount?: number,
    tx?: any,
  ): Promise<Booking>;
  abstract updateBookingStatus(
    id: string,
    status: (typeof bookingStatusEnum.enumValues)[number],
    tx?: any,
  ): Promise<Booking>;
  abstract findBookingsByItem(
    itemId: string,
    status?: string,
  ): Promise<Booking[]>;
  abstract checkAvailability(
    itemId: string,
    from: Date,
    to: Date,
  ): Promise<boolean>;
  abstract deleteBooking(id: string): Promise<void>;
  abstract createChatMessage(
    bookingId: string,
    senderId: string,
    message: string,
    tx?: any,
  ): Promise<void>;
}
