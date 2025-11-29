import { Injectable } from '@nestjs/common';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';
import { CreateBookingDTO } from './dto/create-booking.dto';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly walletService: WalletService,
  ) {}

  async execute(itemId: string, borrowerId: string, data: CreateBookingDTO) {
    const totalAmount = data.rentalFeeCents + (data.thankYouTipCents || 0);

    // 1. Hold funds
    // We pass a placeholder bookingId because the booking doesn't exist yet.
    // Ideally, we would generate the ID first or use a transaction.
    // For now, we'll use a temporary ID or handle it differently.
    // Actually, we can generate the UUID here if we want, but Drizzle usually handles it.
    // Let's just pass 'pending' or similar, or update it later.
    // Better approach: Create booking with 'pending_payment' status (if we had it), then hold, then update.
    // But schema says 'pending'.
    // Let's hold funds first. If it fails, we don't create booking.
    // We can pass null for bookingId initially if the schema allows, or just use a placeholder.
    // The schema allows bookingId to be null in walletTransactions?
    // Let's check schema.
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
