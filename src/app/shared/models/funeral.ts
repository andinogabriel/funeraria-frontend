import { ReceiptType } from './receiptType';
import { Deceased, getDeceasedFormControl } from './deceased';
import { Plan } from './plan';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { onlyTwoDecimalRgx } from '../utils/regex';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

export interface Funeral {
  id?: number;
  funeralDate: string;
  registerDate: string;
  receiptNumber: number;
  receiptSeries: string;
  tax: number | string;
  totalAmount: number | string;
  receiptType: ReceiptType | string;
  deceased: Deceased | string;
  plan: Plan | string;
}

export interface FuneralResponse {
  id?: number;
  funeralDate: string;
  registerDate: string;
  receiptNumber: number;
  receiptSeries: string;
  tax: number;
  totalAmount: number;
  receiptType: string;
  deceased: string;
  plan: string;
}

export interface FuneralRequest {
  funeralDate: number;
  registerDate: string;
  receiptNumber: number;
  receiptSeries: string;
  tax: number;
  receiptType: ReceiptType;
  deceased: Deceased;
  plan: Plan;
}

export type FuneralForm = {
  funeralDate: FormControl<Date>;
  receiptNumber: FormControl<string>;
  receiptSeries: FormControl<string>;
  tax: FormControl<number>;
  receiptType: FormControl<ReceiptType>;
  plan: FormControl<Plan>;
  //deceased: FormControl<Deceased>;
};

export function getFuneralFormControl() : FuneralForm {
  return {
    funeralDate: new FormControl<Date | null>(null, [Validators.required]),
    receiptNumber: new FormControl<string | null>('', [Validators.required]),
    receiptSeries: new FormControl<string | null>('', [Validators.required]),
    tax: new FormControl<number | null>(null, [Validators.required, RxwebValidators.digit(), Validators.pattern(onlyTwoDecimalRgx), Validators.min(1)]),
    receiptType:  new FormControl<ReceiptType | null>(null, [Validators.required]),
    plan: new FormControl<Plan | null>(null, [Validators.required]),
    //deceased: new FormControl<Deceased | null>(null),
  };
}