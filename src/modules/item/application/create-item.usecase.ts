import { Injectable } from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly itemRepo: ItemRepository) {}

  async execute() {}
}
