import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class CompleteBookingUseCase {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user is authorized (owner)
    if (booking.item.ownerId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to complete this booking',
      );
    }

    // Check if current status is 'returned'
    if (booking.status !== 'returned') {
      throw new BadRequestException(
        'Booking must be in returned status to be completed',
      );
    }

    return await this.bookingRepo.updateBookingStatus(bookingId, 'completed');
  }
}
