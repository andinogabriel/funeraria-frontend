import { FormControl, Validators } from "@angular/forms";
import { Category, CategoryForm } from "./category";
import { Item, ItemForm } from "./item";
import { onlyNumberWithoutDecimal } from "../utils/regex";

export interface ItemsPlan {
  item: Item;
  category: Category;
  quantity: number;
}

export type ItemsPlanFormControl = {
  item: FormControl<ItemForm>;
  category: FormControl<CategoryForm>;
  quantity: FormControl<number>;
}

export const ITEM_PLAN_FORM_GROUP = {
  quantity: [null, [Validators.required, Validators.pattern(onlyNumberWithoutDecimal)]],
  item: [null, Validators.required],
  category: [null, Validators.required]
};