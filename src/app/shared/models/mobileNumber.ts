import { FormControl } from "@angular/forms";

export class MobileNumber {
  id: number;
  mobileNumber: string;
}

export type MobileNumberFormGroup = {
  mobileNumber: FormControl<string>;
}