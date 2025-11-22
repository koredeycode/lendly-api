import { Injectable } from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';
import { UpdateItemDTO } from './dto/update-item.dto';

@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly itemRepo: ItemRepository) {}

  async execute(id: string, data: UpdateItemDTO) {
    await this.itemRepo.updateItem(id, data);
  }
}
