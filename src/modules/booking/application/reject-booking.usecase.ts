import {
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
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class RejectBookingUseCase {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly bookingRepo: BookingRepository,
    private readonly walletService: WalletService,
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

      // Only owner or borrower can reject/cancel
      if (item.ownerId !== userId && booking.borrowerId !== userId) {
        throw new UnauthorizedException(
          'Not authorized to reject this booking',
        );
      }

      if (booking.status !== 'pending') {
        throw new Error('Booking is not pending');
      }

      // Release funds
      await this.walletService.releaseFunds(
        booking.borrowerId,
        booking.totalChargedCents,
        bookingId,
        tx,
      );

      // Send funds released email to borrower
      const borrower = await this.userRepo.findUserById(booking.borrowerId);
      if (borrower) {
         await this.emailJobService.sendFundsReleasedEmail({
            email: borrower.email,
            name: borrower.name,
            amount: (booking.totalChargedCents / 100).toLocaleString('en-NG', {
              style: 'currency',
              currency: 'NGN',
            }),
            itemName: item.title,
            reason: 'Booking rejected/cancelled',
         });
      }

      // Update status
      const updatedBooking = await this.bookingRepo.updateBookingStatus(
        bookingId,
        'cancelled',
        tx,
      );

      // Send email to borrower (if rejected by owner)
      if (item.ownerId === userId) {
        const borrower = await this.userRepo.findUserById(booking.borrowerId);
        if (borrower) {
          await this.emailJobService.sendBookingRejectedEmail({
            email: borrower.email,
            borrowerName: borrower.name,
            itemName: item.title,
          });
        }
      }

      return updatedBooking;
    });
  }
}
