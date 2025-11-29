import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async findBooking(id: string) {
    const booking = await this.bookingRepo.findBookingById(id);
    if (booking == null) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async deleteBooking(id: string, userId: string) {
    const booking = await this.findBooking(id);
    if (booking.borrowerId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }
    await this.bookingRepo.deleteBooking(id);
  }

  async getUserBookings(userId: string, type: 'borrower' | 'owner') {
    return await this.bookingRepo.getBookingsForUser(userId, type);
  }

  async findBookingsByItem(itemId: string) {
    return await this.bookingRepo.findBookingsByItem(itemId);
  }

  async checkAvailability(itemId: string, from: Date, to: Date) {
    return await this.bookingRepo.checkAvailability(itemId, from, to);
  }
}
