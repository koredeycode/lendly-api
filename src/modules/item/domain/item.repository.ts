import { Item } from 'src/config/db/schema';
import { CreateItemDTO } from '../application/dto/create-item.dto';
import { SearchItemsDTO } from '../application/dto/search-items.dto';
import { UpdateItemDTO } from '../application/dto/update-item.dto';

export type ItemWithOwner = Item & { owner: { id: string; name: string } };

export abstract class ItemRepository {
  abstract createItem(ownerId: string, data: CreateItemDTO): Promise<Item>;
  abstract findItemById(id: string): Promise<ItemWithOwner | null>;
  abstract findItemsByOwner(ownerId: string, includeDeleted: boolean);
  abstract searchItems(search: SearchItemsDTO): Promise<Item[]>;
  abstract updateItem(id: string, data: UpdateItemDTO, tx?: any): Promise<Item>;
  abstract softDeleteItem(id: string): Promise<Item>;
}
