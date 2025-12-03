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
export class PickupBookingUseCase {
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

      if (booking.borrowerId !== userId) {
        throw new UnauthorizedException(
          'Only the borrower can mark the item as picked up',
        );
      }

      if (booking.status !== 'accepted') {
        throw new BadRequestException('Booking is not in accepted state');
      }

      // Transfer funds
      await this.walletService.transferFunds(
        booking.borrowerId,
        booking.item.owner.id,
        booking.totalChargedCents,
        bookingId,
        tx,
        booking.item.title,
      );

      // Send payout received email to owner
      await this.emailJobService.sendPayoutReceivedEmail({
        email: booking.item.owner.email,
        name: booking.item.owner.name,
        amount: (booking.totalChargedCents / 100).toLocaleString('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }),
        itemName: booking.item.title,
        bookingId: bookingId,
      });

      // Update status
      await this.bookingRepo.updateBookingStatus(bookingId, 'picked_up', tx);
    });
  }
}
