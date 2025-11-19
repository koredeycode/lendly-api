export abstract class BookingRepository {
  abstract createBooking();
  abstract findBookingById();
  abstract getBookingsForUser();
  abstract acceptBooking();
  abstract updateBookingStatus();
}
