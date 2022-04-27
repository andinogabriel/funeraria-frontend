import { ReceiptType } from './receiptType';
import { Supplier } from './supplier';
import { User } from './user';

export interface Income {
  id?: number;
  receiptNumber: number;
  receiptSeries: number;
  entryDate: number;
  tax: number;
  totalAmount: number;
  receiptType: ReceiptType;
  entrySupplier: Supplier;
  entryUser: User;
  deleted?: boolean;
  lastModifiedBy?: User;
  lastModifiedDate?: number;
}