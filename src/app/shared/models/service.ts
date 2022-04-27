import { Deceased } from "./deceased";
import { Item } from "./item";
import { ReceiptType } from "./receiptType";

export interface Service {
  id?: number;
  serviceDate: number;
  receiptNumber: string;
  receiptSeries: string;
  tax: number;
  totalAmount: number;
  registerDate: number;
  deceased: Deceased;
  receiptType: ReceiptType;
  serviceDetails: Item[];
}