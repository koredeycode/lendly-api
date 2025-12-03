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
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class AcceptBookingUseCase {
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

      if (booking.item.owner.id !== userId) {
        throw new UnauthorizedException('Only the owner can approve bookings');
      }

      if (booking.status !== 'pending') {
        throw new BadRequestException('Booking is not pending');
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
      await this.bookingRepo.acceptBooking(
        bookingId,
        booking.thankYouTipCents || 0,
        tx,
      );

      // Mark item as unavailable
      await this.itemRepo.updateItem(
        booking.item.id,
        { isAvailable: false } as any,
        tx,
      );

      // Send email to borrower
      await this.emailJobService.sendBookingApprovedEmail({
        email: booking.borrower.email,
        borrowerName: booking.borrower.name,
        itemName: booking.item.title,
        bookingId: bookingId,
      });
    });
  }
}
