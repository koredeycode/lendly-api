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
export class ApproveBookingUseCase {
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

      if (item.ownerId !== userId) {
        throw new UnauthorizedException('Only the owner can approve bookings');
      }

      if (booking.status !== 'pending') {
        throw new Error('Booking is not pending');
      }

      // Transfer funds
      await this.walletService.transferFunds(
        booking.borrowerId,
        item.ownerId,
        booking.totalChargedCents,
        bookingId,
        tx,
      );

      // Send payout received email to owner
      const owner = await this.userRepo.findUserById(item.ownerId);
      if (owner) {
         await this.emailJobService.sendPayoutReceivedEmail({
            email: owner.email,
            name: owner.name,
            amount: (booking.totalChargedCents / 100).toLocaleString('en-NG', {
              style: 'currency',
              currency: 'NGN',
            }),
            itemName: item.title,
            bookingId: bookingId,
         });
      }

      // Update status
      await this.bookingRepo.acceptBooking(
        bookingId,
        booking.thankYouTipCents || 0,
        tx,
      );

      // Mark item as unavailable
      await this.itemRepo.updateItem(
        booking.itemId,
        { isAvailable: false } as any,
        tx,
      );

      // Send email to borrower
      const borrower = await this.userRepo.findUserById(booking.borrowerId);
      if (borrower) {
        await this.emailJobService.sendBookingApprovedEmail({
          email: borrower.email,
          borrowerName: borrower.name,
          itemName: item.title,
          bookingId: bookingId,
        });
      }
    });
  }
}
