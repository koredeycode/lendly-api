import { ItemCreateDto, ItemUpdateDto } from '@koredeycode/lendly-types';

export abstract class ItemRepository {
  abstract createItem(data: ItemCreateDto);
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
  abstract updateItem(id: string, data: ItemUpdateDto);
  abstract softDeleteItem(id: string);
}
