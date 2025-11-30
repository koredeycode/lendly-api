import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';

@Injectable()
export class DeleteItemUseCase {
  constructor(private readonly itemRepo: ItemRepository) {}

  async execute(userId: string, id: string) {
    const item = await this.itemRepo.findItemById(id);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.owner.id !== userId) {
      throw new ForbiddenException('You are not the owner of this item');
    }

    await this.itemRepo.softDeleteItem(id);
  }
}
