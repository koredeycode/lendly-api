import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';
import { SearchItemsDTO } from './dto/search-items.dto';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepo: ItemRepository) {}

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
      throw new NotFoundException('You are not the owner of this item');
    }

    return await this.itemRepo.updateItem(itemId, {
      isAvailable: !item.isAvailable,
    } as any);
  }
}
