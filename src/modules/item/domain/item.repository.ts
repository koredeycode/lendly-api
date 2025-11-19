export abstract class ItemRepository {
  abstract createItem();
  abstract findItemById();
  abstract findItemsByOwner();
  abstract searchItems();
  abstract updateItem();
  abstract softDeleteItem();
}
