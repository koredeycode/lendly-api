import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepo: ItemRepository) {}

  async findItem(id: string) {
    const item = this.itemRepo.findItemById(id);
    if (item === null) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }
}
