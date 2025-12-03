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
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class ReturnBookingUseCase {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly bookingRepo: BookingRepository,
    private readonly itemRepo: ItemRepository,
  ) {}

  async execute(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.item.ownerId !== userId) {
      throw new UnauthorizedException('You are not authorized to mark this booking as returned');
    }

    if (booking.status !== 'picked_up' && booking.status !== 'accepted') {
      throw new BadRequestException(
        'Booking must be picked up or accepted before it can be returned',
      );
    }

    return await this.db.transaction(async (tx) => {
      // 1. Update booking status to returned
      const updatedBooking = await this.bookingRepo.updateBookingStatus(
        bookingId,
        'returned',
        tx,
      );

      // 2. Mark item as available - REMOVED as per new logic
      // await this.itemRepo.updateItem(
      //   booking.itemId,
      //   { isAvailable: true } as any,
      //   tx,
      // );

      return updatedBooking;
    });
  }
}
