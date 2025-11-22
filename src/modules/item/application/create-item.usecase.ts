import { Injectable } from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';
import { CreateItemDTO } from './dto/create-item.dto';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly itemRepo: ItemRepository) {}

  async execute(ownerId: string, data: CreateItemDTO) {
    const item = await this.itemRepo.createItem(ownerId, data);
    return item;
  }
}
