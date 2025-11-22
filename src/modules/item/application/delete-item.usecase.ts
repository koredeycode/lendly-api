import { Injectable } from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';

@Injectable()
export class DeleteItemUseCase {
  constructor(private readonly itemRepo: ItemRepository) {}

  async execute(id: string) {
    await this.itemRepo.softDeleteItem(id);
  }
}
