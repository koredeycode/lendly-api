import { BookingCreateDto, bookingStatusEnum } from '@koredeycode/lendly-types';

export abstract class BookingRepository {
  abstract createBooking(data: BookingCreateDto);
  abstract findBookingById(id: string);
  abstract getBookingsForUser(userId, type: string);
  abstract acceptBooking(bookingId: string, tipCents: number);
  abstract updateBookingStatus(
    bookingId: string,
    status: (typeof bookingStatusEnum.enumValues)[number],
  );
}
