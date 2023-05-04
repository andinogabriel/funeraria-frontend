import { FormControl, Validators } from "@angular/forms";
import { Item } from "./item";
import { onlyNumberWithoutDecimal, onlyTwoDecimalRgx } from "../utils/regex";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { Category } from "./category";

export interface IncomeDetail {
  id?: number;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  item: Item;
}

export type IncomeDetailForm = {
  quantity: FormControl<number>;
  purchasePrice: FormControl<number>;
  salePrice: FormControl<number>;
  item: FormControl<Item>;
  category?: FormControl<Category>;
};

export const INCOME_DETAIL_FORM_CONTROL = {
  quantity: [null, [Validators.required, Validators.min(1), Validators.pattern(onlyNumberWithoutDecimal), RxwebValidators.digit()]],
  purchasePrice: [null, [Validators.required, Validators.min(1), Validators.pattern(onlyTwoDecimalRgx), RxwebValidators.digit()]],
  salePrice: [null, [Validators.required, Validators.min(1), Validators.pattern(onlyTwoDecimalRgx), RxwebValidators.digit()]],
  item: [null, [Validators.required]],
  category: [null, [Validators.required]]
};
