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
import { ItemRepository } from 'src/modules/item/domain/item.repository';
import { EmailJobService } from 'src/modules/jobs/application/email-job.service';
import { UserRepository } from 'src/modules/user/domain/user.repository';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class MarkBookingOverdueUseCase {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly bookingRepo: BookingRepository,
    private readonly itemRepo: ItemRepository,
    private readonly userRepo: UserRepository,
    private readonly emailJobService: EmailJobService,
  ) {}

  async execute(bookingId: string, userId: string) {
    return await this.db.transaction(async (tx) => {
      const booking = await this.bookingRepo.findBookingById(bookingId);
      if (!booking) throw new NotFoundException('Booking not found');

      const item = await this.itemRepo.findItemById(booking.itemId);
      if (!item) throw new NotFoundException('Item not found');

      // Only owner can mark as overdue
      if (item.ownerId !== userId) {
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
      const borrower = await this.userRepo.findUserById(booking.borrowerId);
      if (borrower) {
        await this.emailJobService.sendBookingOverdueEmail({
          email: borrower.email,
          borrowerName: borrower.name,
          itemName: item.title,
          bookingId: bookingId,
        });
      }

      return updatedBooking;
    });
  }
}
