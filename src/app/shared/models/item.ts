import { Brand } from "./brand";
import { Category } from "./category";

export interface Item {
  id?: number;
  name: string;
  description?: string;
  code: string;
  itemImageLink?: string;
  price: number | string;
  itemLength?: number;
  itemHeight?: number;
  itemWidth?: number;
  stock?: number;
  category: Category;
  categoryName?: string;
  brand?: Brand;
  brandName?: string;
}