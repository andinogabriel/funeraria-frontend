import { FormControl, Validators } from "@angular/forms";

export interface Category {
  id?: number;
  name: string;
  description: string;
}

export type CategoryForm = {
  name: FormControl<string>;
  description: FormControl<string>;
};

export const CATEGORY_FORM_CONTROL = {
  name: new FormControl(null, [Validators.required]),
  description: new FormControl(null, [Validators.required]),
}
