import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from 'src/modules/item/domain/item.repository';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class ApproveBookingUseCase {
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

    if (item.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this item');
    }

    if (booking.status !== 'pending') {
      throw new ForbiddenException('Booking is not pending');
    }

    const totalAmount = booking.rentalFeeCents + (booking.thankYouTipCents || 0);

    // Transfer funds
    await this.walletService.transferFunds(
      booking.borrowerId,
      item.ownerId,
      totalAmount,
      booking.id,
    );

    // Update booking status
    const updatedBooking = await this.bookingRepo.acceptBooking(booking.id, booking.thankYouTipCents || 0);
    
    return updatedBooking;
  }
}
