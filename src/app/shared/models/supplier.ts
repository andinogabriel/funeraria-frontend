import { Address } from "cluster";
import { MobileNumber } from "./mobileNumber";

export interface Supplier {
  id?: number;
  name: string;
  nif: string;
  webPage?: string;
  email: string;
  addresses: Address[];
  mobileNumbers: MobileNumber[];
}