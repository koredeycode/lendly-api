import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../domain/booking.repository';
import { CreateBookingDTO } from './dto/create-booking.dto';

@Injectable()
export class CreateBookingUseCase {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(itemId: string, borrowerId: string, data: CreateBookingDTO) {
    const booking = await this.bookingRepo.createBooking(
      itemId,
      borrowerId,
      data,
    );
    return booking;
  }
}
