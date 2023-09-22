import { Address } from "./address";
import { MobileNumber } from "./mobileNumber";

export interface SignupUser {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  matchingPassword: string;
  mobileNumbers: MobileNumber[];
  addresses: Address[];
}

export interface AccountUser {
  password: string;
  matchingPassword: string;
  mobileNumbers: MobileNumber[];
  addresses: Address[];
}

