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
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class RejectBookingUseCase {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly bookingRepo: BookingRepository,
    private readonly walletService: WalletService,
    private readonly emailJobService: EmailJobService,
  ) {}

  async execute(bookingId: string, userId: string) {
    return await this.db.transaction(async (tx) => {
      const booking = await this.bookingRepo.findBookingById(bookingId);
      if (!booking) throw new NotFoundException('Booking not found');

      // Only owner can reject
      if (booking.item.owner.id !== userId) {
        throw new UnauthorizedException(
          'Not authorized to reject this booking',
        );
      }

      if (booking.status !== 'pending') {
        throw new BadRequestException('Booking is not pending');
      }

      // Release funds
      await this.walletService.releaseFunds(
        booking.borrowerId,
        booking.totalChargedCents,
        bookingId,
        tx,
        'booking rejected',
        booking.item.title,
      );

      // Send funds released email to borrower
      await this.emailJobService.sendFundsReleasedEmail({
        email: booking.borrower.email,
        name: booking.borrower.name,
        amount: (booking.totalChargedCents / 100).toLocaleString('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }),
        itemName: booking.item.title,
        reason: 'Booking rejected',
      });

      // Update status
      const updatedBooking = await this.bookingRepo.updateBookingStatus(
        bookingId,
        'rejected',
        tx,
      );

      // Send email to borrower
      await this.emailJobService.sendBookingRejectedEmail({
        email: booking.borrower.email,
        borrowerName: booking.borrower.name,
        itemName: booking.item.title,
        bookingId: bookingId,
      });

      return updatedBooking;
    });
  }
}
