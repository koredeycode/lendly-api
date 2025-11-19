import { Item } from './item.entity';

export abstract class ItemRepository {
  abstract createItem(ownerId: string, data: Item);
  abstract findItemById(id: string);
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
  abstract updateItem(id: string, data: Partial<Item>);
  abstract softDeleteItem(id: string);
}
