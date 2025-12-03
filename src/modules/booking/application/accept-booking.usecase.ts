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

      if (booking.item.ownerId !== userId) {
        throw new UnauthorizedException('Only the owner can approve bookings');
      }

      if (!booking.item.isAvailable) {
        throw new BadRequestException(
          'Item is marked as unavailable by owner. Please make it available before accepting bookings.',
        );
      }

      if (booking.status !== 'pending') {
        throw new BadRequestException('Booking is not pending');
      }

      // Check for overlapping bookings before accepting
      const isAvailable = await this.bookingRepo.checkAvailability(
        booking.itemId,
        new Date(booking.requestedFrom),
        new Date(booking.requestedTo),
        tx,
      );

      if (!isAvailable) {
        throw new BadRequestException(
          'Item is no longer available for these dates',
        );
      }

      // Update status
      await this.bookingRepo.acceptBooking(
        bookingId,
        booking.thankYouTipCents || 0,
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
