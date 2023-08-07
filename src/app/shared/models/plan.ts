import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ItemsPlan, ItemsPlanFormControl } from "./itemsPlan";
import { onlyTwoDecimalRgx } from "../utils/regex";

export interface PlanRequest {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  profitPercentage: number;
  itemsPlan: ItemsPlan[];
}

export interface Plan {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number | string;
  profitPercentage: number;
  itemsPlan: ItemsPlan[];
}

export const PLAN_FORM_CONTROL = {
  name: new FormControl<string | null>('', [Validators.required]),
  profitPercentage:  new FormControl<number | null>(null, [Validators.required, Validators. min(1), Validators.pattern(onlyTwoDecimalRgx)]),
  description: new FormControl<string | null>(''),
  itemsPlan:  new FormArray<FormGroup<ItemsPlanFormControl>>([]),
};
