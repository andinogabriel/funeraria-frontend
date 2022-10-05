import { IncomeDetail } from './incomeDetail';
import { ReceiptType } from './receiptType';
import { Supplier } from './supplier';
import { User } from './user';

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
  lastModifiedDate?: number;
  incomeDetails: IncomeDetail[];
}