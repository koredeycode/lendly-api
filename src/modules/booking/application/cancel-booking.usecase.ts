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
export class CancelBookingUseCase {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly bookingRepo: BookingRepository,
    private readonly walletService: WalletService,
    private readonly emailJobService: EmailJobService,
  ) {}

  async execute(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.borrowerId !== userId) {
      throw new UnauthorizedException('You are not authorized to cancel this booking');
    }

    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking is not in pending state');
    }

    return await this.db.transaction(async (tx) => {
      // 1. Update status to cancelled
      const updatedBooking = await this.bookingRepo.updateBookingStatus(
        bookingId,
        'cancelled',
        tx,
      );

      // 2. Release held funds
      // We need to know how much was held.
      // The booking has `totalChargedCents` which was calculated during creation.
      // Assuming this is the amount held.
      // Wait, `createBooking` sets `totalChargedCents`.
      // And `holdFunds` uses `totalAmount`.
      // So `booking.totalChargedCents` should be correct.

      if (booking.totalChargedCents > 0) {
        await this.walletService.releaseFunds(
          booking.borrowerId,
          booking.totalChargedCents,
          booking.id,
          tx,
          'booking cancelled',
          booking.item.title,
        );
      }

      // 3. Send email notification (optional but good)
      // Maybe notify the owner that the request was cancelled?
      // And notify borrower that funds are released.

      await this.emailJobService.sendBookingCancelledEmail({
        email: booking.item.owner.email,
        ownerName: booking.item.owner.name,
        borrowerName: booking.borrower.name,
        itemName: booking.item.title,
        bookingId: booking.id,
      });

      await this.emailJobService.sendFundsReleasedEmail({
        email: booking.borrower.email,
        name: booking.borrower.name,
        amount: (booking.totalChargedCents / 100).toLocaleString('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }),
        itemName: booking.item.title,
        reason: 'Booking cancelled',
      });

      // For now, let's just return the updated booking.
      return updatedBooking;
    });
  }
}
