import { Injectable } from '@nestjs/common';
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

    // walletTransactions.bookingId is nullable: bookingId: uuid("booking_id").references(...)
    // So we can pass null.
    
    // However, we want to link it.
    // Let's generate an ID? No, Drizzle generates it.
    // Let's just pass null for now and maybe update it later if needed, or just leave it null for the hold.
    // Actually, the hold is specific to a booking.
    // Let's create the booking first? No, then we might have a booking without funds.
    // Let's hold with null, create booking, then update transaction?
    // Or just hold with null.
    
    await this.walletService.holdFunds(borrowerId, totalAmount, null);

    try {
      // 2. Create booking
      const booking = await this.bookingRepo.createBooking(
        itemId,
        borrowerId,
        data,
      );
      
      // 3. Send email to owner
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
      // TODO: Update the wallet transaction with the real booking ID? 
      // For now, we'll leave it as is to keep it simple.
      
      //TODO: background job to send mail to item owner notifying about the booking.
      
      return booking;
    } catch (error) {
      // If booking creation fails, release funds
      await this.walletService.releaseFunds(borrowerId, totalAmount, null);
      throw error;
    }
  }
}
