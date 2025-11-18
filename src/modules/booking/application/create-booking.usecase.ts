import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class CreateBookingUseCase {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute() {}
}
