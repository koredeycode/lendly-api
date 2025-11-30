import { Injectable, NotFoundException } from '@nestjs/common';
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
      // 1. Create booking first to get the ID
      const booking = await this.bookingRepo.createBooking(
        itemId,
        borrowerId,
        data,
        tx,
      );
      console.log('Booking created successfully', booking);
      // 2. Hold funds (will throw if insufficient)
      // Now we have the booking ID to link the transaction!
      await this.walletService.holdFunds(
        borrowerId,
        totalAmount,
        booking.id,
        tx,
      );

      console.log('funds successfully held');
      try {
        // 3. Send email to owner (outside transaction or inside? inside is safer for consistency, but email sending should be async/job)
        // The email job service just adds to queue, so it's fast.
        const item = await this.itemRepo.findItemById(itemId);

        if (!item) {
          throw new NotFoundException('Item not found');
        }

        const owner = await this.userRepo.findUserById(item.ownerId);

        const borrower = await this.userRepo.findUserById(borrowerId);

        if (owner && borrower) {
          // 4. Create chat message if provided
          if (data.message) {
            await this.bookingRepo.createChatMessage(
              booking.id,
              borrowerId,
              data.message,
              // Note: Chat message creation is outside the transaction to avoid locking issues if possible, 
              // or we can pass tx if we want it atomic. 
              // Since the method signature in repo supports tx, let's pass it if we were inside transaction block.
              // BUT we are inside the try/catch block which is AFTER the transaction committed?
              // Wait, line 23 `db.transaction` wraps everything.
              // So we are inside the transaction.
              // However, the `bookingRepo.createChatMessage` implementation I added accepts `tx`.
              // Let's pass `tx` to ensure atomicity.
              tx
            );
          }

          await this.emailJobService.sendBookingRequestedEmail({
            email: owner.email,
            ownerName: owner.name,
            borrowerName: borrower.name,
            itemName: item.title,
            message: data.message,
          });
        }

        return booking;
      } catch (error) {
        // If anything fails, the transaction will rollback.
        throw error;
      }
    });
  }
}
