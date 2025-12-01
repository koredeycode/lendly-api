import {
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class PickupBookingUseCase {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly bookingRepo: BookingRepository,
  ) {}

  async execute(bookingId: string, userId: string) {
    return await this.db.transaction(async (tx) => {
      const booking = await this.bookingRepo.findBookingById(bookingId);
      if (!booking) throw new NotFoundException('Booking not found');

      if (booking.borrowerId !== userId) {
        throw new UnauthorizedException(
          'Only the borrower can mark the item as picked up',
        );
      }

      if (booking.status !== 'accepted') {
        throw new Error('Booking is not in accepted state');
      }

      // Update status
      await this.bookingRepo.updateBookingStatus(bookingId, 'picked_up', tx);
    });
  }
}
