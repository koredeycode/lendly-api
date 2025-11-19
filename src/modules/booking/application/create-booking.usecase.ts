import { Injectable } from '@nestjs/common';
import { Booking } from '../domain/booking.entity';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class CreateBookingUseCase {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(borrowerId: string, data: Booking) {
    const booking = await this.bookingRepo.createBooking(borrowerId, data);
    return booking;
  }
}
