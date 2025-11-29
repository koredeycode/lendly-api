import { Injectable } from '@nestjs/common';
import { db } from 'src/config/db/drizzle/client';
import { ItemRepository } from 'src/modules/item/domain/item.repository';
import { EmailJobService } from 'src/modules/jobs/application/email-job.service';
import { UserRepository } from 'src/modules/user/domain/user.repository';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';
import { CreateBookingDTO } from './dto/create-booking.dto';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly walletService: WalletService,
    private readonly itemRepo: ItemRepository,
    private readonly userRepo: UserRepository,
    private readonly emailJobService: EmailJobService,
  ) {}

  async execute(itemId: string, borrowerId: string, data: CreateBookingDTO) {
    const totalAmount = data.rentalFeeCents + (data.thankYouTipCents || 0);

    return await db.transaction(async (tx) => {
      // 1. Hold funds (will throw if insufficient)
      await this.walletService.holdFunds(borrowerId, totalAmount, null, tx);

      try {
        // 2. Create booking
        const booking = await this.bookingRepo.createBooking(
          itemId,
          borrowerId,
          data,
          tx,
        );

        // 3. Send email to owner (outside transaction or inside? inside is safer for consistency, but email sending should be async/job)
        // The email job service just adds to queue, so it's fast.
        const item = await this.itemRepo.findItemById(itemId);
        const owner = await this.userRepo.findUserById(item.ownerId);
        const borrower = await this.userRepo.findUserById(borrowerId);

        if (owner && borrower) {
          await this.emailJobService.sendBookingRequestedEmail({
            email: owner.email,
            ownerName: owner.name,
            borrowerName: borrower.name,
            itemName: item.title,
          });
        }

        return booking;
      } catch (error) {
        // If booking creation fails, the transaction will rollback, so no need to manually release funds!
        // That's the beauty of transactions.
        throw error;
      }
    });
  }
}
