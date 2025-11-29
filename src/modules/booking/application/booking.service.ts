import { Injectable, NotFoundException } from '@nestjs/common';
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

  async deleteBooking(id: string) {
    await this.bookingRepo.deleteBooking(id);
  }

  async findBookingsByItem(itemId: string) {
    return await this.bookingRepo.findBookingsByItem(itemId);
  }

  async checkAvailability(itemId: string, from: Date, to: Date) {
    return await this.bookingRepo.checkAvailability(itemId, from, to);
  }
}
