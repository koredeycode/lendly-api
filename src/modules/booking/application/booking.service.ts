import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepo: BookingRepository) {}
}
