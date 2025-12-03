import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { BookingRepository } from 'src/modules/booking/domain/booking.repository';
import { ItemRepository } from '../domain/item.repository';
import { SearchItemsDTO } from './dto/search-items.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly itemRepo: ItemRepository,
    private readonly bookingRepo: BookingRepository,
  ) {}

  async findItem(id: string) {
    const item = await this.itemRepo.findItemById(id);
    if (item === null) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async searchItems(search: SearchItemsDTO) {
    const items = await this.itemRepo.searchItems(search);
    return items;
  }

  async getUserItems(userId: string) {
    return this.itemRepo.findItemsByOwner(userId, false);
  }

  async toggleAvailability(itemId: string, userId: string) {
    const item = await this.itemRepo.findItemById(itemId);
    if (!item) throw new NotFoundException('Item not found');

    if (item.ownerId !== userId) {
      throw new UnauthorizedException('You are not the owner of this item');
    }

    // If trying to mark as unavailable (current isAvailable is true)
    if (item.isAvailable) {
      // Check for active bookings (accepted or picked_up)
      const activeBookings = await this.bookingRepo.findBookingsByItem(
        itemId,
        'accepted',
      );
      const pickedUpBookings = await this.bookingRepo.findBookingsByItem(
        itemId,
        'picked_up',
      );

      if (activeBookings.length > 0 || pickedUpBookings.length > 0) {
        throw new BadRequestException(
          'Cannot mark item as unavailable while there are active bookings',
        );
      }
    }

    return await this.itemRepo.updateItem(itemId, {
      isAvailable: !item.isAvailable,
    } as any);
  }
}
