import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { INCOME_DETAIL_FORM_CONTROL, IncomeDetail } from './incomeDetail';
import { ReceiptType } from './receiptType';
import { Supplier } from './supplier';
import { User } from './user';
import { onlyTwoDecimalRgx } from '../utils/regex';

export interface Income {
  id?: number;
  receiptNumber: number;
  receiptSeries: number;
  incomeDate: number;
  tax: number;
  totalAmount: number;
  receiptType: ReceiptType;
  supplier: Supplier;
  incomeUser: User;
  deleted?: boolean;
  lastModifiedBy?: User;
  lastModifiedDate?: number;
  incomeDetails: IncomeDetail[];
}

export interface IncomeToShow {
  id?: number;
  receiptNumber: number;
  receiptSeries: number;
  incomeDate: string;
  tax: string;
  totalAmount: string;
  receiptType: string;
  supplier: string;
  incomeUser: User;
  deleted?: boolean;
  lastModifiedBy?: User;
  lastModifiedDate?: string;
  incomeDetails: IncomeDetail[];
}

export type IncomeForm = {
  receiptNumber: FormControl<number>;
  receiptSeries: FormControl<number>;
  tax: FormControl<number>,
  receiptType: FormControl<ReceiptType>;
  supplier: FormControl<Supplier>;
  incomeDetails: FormArray;
};

export const INCOME_FORM_CONTROL = {
  receiptNumber: new FormControl(null),
  receiptSeries: new FormControl(null),
  tax: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100), Validators.required, Validators.pattern(onlyTwoDecimalRgx)]),
  receiptType: new FormControl(null, [Validators.required]),
  supplier: new FormControl(null, [Validators.required]),
  incomeDetails: new FormArray([])
};

/*export function getIncomeFormControl(): IncomeForm {
  return {
    receiptNumber: new FormControl(null),
    receiptSeries: new FormControl(null),
    tax: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100), Validators.required, Validators.pattern(onlyTwoDecimalRgx)]),
    receiptType: new FormControl(null, [Validators.required]),
    supplier: new FormControl(null, [Validators.required]),
    incomeDetails: new FormArray([new FormBuilder().group(INCOME_DETAIL_FORM_CONTROL)])
  };
}*/
