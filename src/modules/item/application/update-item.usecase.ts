import { Injectable } from '@nestjs/common';
import { ItemRepository } from '../domain/item.repository';

@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly itemRepo: ItemRepository) {}

  async execute() {}
}
