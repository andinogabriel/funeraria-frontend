import { Category } from "./category";
import { Item } from "./item";

export interface ItemsPlan {
  item: Item;
  category: Category;
  quantity: number;
}