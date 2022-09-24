import { MobileNumber } from "./mobileNumber";
import { Roles } from "./roles";
import { Affiliate } from './../../features/models/affiliate';
import { Deceased } from "./deceased";
import { Address } from "./address";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string
  startDate: string;
  enabled: boolean;
  roles: Roles[];
  mobileNumbers: MobileNumber[];
  addresses: Address[];
  affiliates: Affiliate[];
  deceasedList: Deceased[];
}