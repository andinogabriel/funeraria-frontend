import { Item } from '../models/item';


export const filterAlreadySelectedItems = (items: Item[], itemsFormGroup: Item[]) => (
  items.filter(val => !itemsFormGroup.includes(val))
);
