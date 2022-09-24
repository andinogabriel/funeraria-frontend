import { Item } from "./item";

export interface IncomeDetail {
  id?: number;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  item: Item;
}