import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import { EmailJobService } from 'src/modules/jobs/application/email-job.service';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class MarkBookingOverdueUseCase {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly bookingRepo: BookingRepository,
    private readonly emailJobService: EmailJobService,
  ) {}

  async execute(bookingId: string, userId: string) {
    return await this.db.transaction(async (tx) => {
      const booking = await this.bookingRepo.findBookingById(bookingId);
      if (!booking) throw new NotFoundException('Booking not found');

      // Only owner can mark as overdue
      if (booking.item.ownerId !== userId) {
        throw new UnauthorizedException(
          'Only the item owner can mark booking as overdue',
        );
      }

      // Check if status is picked_up
      if (booking.status !== 'picked_up') {
        throw new BadRequestException(
          'Booking must be picked up before it can be marked overdue',
        );
      }

      // Check if actually overdue
      if (new Date() <= booking.requestedTo) {
        throw new BadRequestException('Booking is not yet overdue');
      }

      // Update status
      const updatedBooking = await this.bookingRepo.updateBookingStatus(
        bookingId,
        'overdue',
        tx,
      );

      // Send email to borrower
      await this.emailJobService.sendBookingOverdueEmail({
        email: booking.borrower.email,
        borrowerName: booking.borrower.name,
        itemName: booking.item.title,
        bookingId: bookingId,
      });

      return updatedBooking;
    });
  }
}
