import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from 'src/modules/item/domain/item.repository';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class RejectBookingUseCase {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly walletService: WalletService,
    private readonly itemRepo: ItemRepository,
  ) {}

  async execute(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const item = await this.itemRepo.findItemById(booking.itemId);
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Allow owner to reject or borrower to cancel
    if (item.ownerId !== userId && booking.borrowerId !== userId) {
      throw new ForbiddenException('You are not authorized to reject/cancel this booking');
    }

    if (booking.status !== 'pending') {
      throw new ForbiddenException('Booking is not pending');
    }

    const totalAmount = booking.rentalFeeCents + (booking.thankYouTipCents || 0);

    // Release funds
    await this.walletService.releaseFunds(
      booking.borrowerId,
      totalAmount,
      booking.id,
    );

    // Update booking status
    const status = item.ownerId === userId ? 'cancelled' : 'cancelled'; // Or 'rejected' if owner? Schema has 'cancelled'.
    // Schema has 'cancelled'. Let's use that for now.
    // If owner rejects, it's effectively cancelled.
    
    const updatedBooking = await this.bookingRepo.updateBookingStatus(booking.id, 'cancelled');
    
    return updatedBooking;
  }
}
