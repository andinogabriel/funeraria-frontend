import { FormControl, Validators } from "@angular/forms";
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

export type ItemForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  brand: FormControl<Brand>;
  code: FormControl<string>;
  price: FormControl<number>;
  itemLength: FormControl<number>;
  itemHeight: FormControl<number>;
  itemWidth: FormControl<number>;
  category: FormControl<Category>;
};

export function getItemFormControl() : ItemForm {
  return {
    name: new FormControl<string | null>('', [Validators.required]),
    brand: new FormControl<Brand | null>(null, [Validators.required]),
    description: new FormControl<string | null>(''),
    code: new FormControl<string | null>(''),
    price: new FormControl<number | null>(null),
    category: new FormControl<Category | null>(null, [Validators.required]),
    itemLength: new FormControl<number | null>(null),
    itemWidth: new FormControl<number | null>(null),
    itemHeight: new FormControl<number | null>(null),
  };
}
