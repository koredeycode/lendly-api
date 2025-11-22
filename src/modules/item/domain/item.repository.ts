import { Item } from '@koredeycode/lendly-types';
import { CreateItemDTO } from '../application/dto/create-item.dto';
import { UpdateItemDTO } from '../application/dto/update-item.dto';

export abstract class ItemRepository {
  abstract createItem(ownerId: string, data: CreateItemDTO): Promise<Item>;
  abstract findItemById(id: string): Promise<Item>;
  abstract findItemsByOwner(ownerId: string, includeDeleted: boolean);
  abstract searchItems(search: {
    lat: number;
    lng: number;
    radiusKm: number;
    category: string;
    onlyAvailable: boolean;
    onlyFree: boolean;
    search: string;
    page: number;
    limit: number;
  });
  abstract updateItem(id: string, data: UpdateItemDTO): Promise<Item>;
  abstract softDeleteItem(id: string): Promise<Item>;
}
