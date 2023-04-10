import { ReceiptType } from './receiptType';
import { Deceased } from './deceased';
import { Plan } from './plan';

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