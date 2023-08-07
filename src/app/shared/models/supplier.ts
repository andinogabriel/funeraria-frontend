import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Address, AddressFormGroup } from "./address";
import { MobileNumber, MobileNumberFormGroup } from "./mobileNumber";

export interface Supplier {
  id?: number;
  name: string;
  nif: string;
  webPage?: string;
  email: string;
  addresses: Address[];
  mobileNumbers: MobileNumber[];
}

export const SUPPLIER_FORM_CONTROL = {
  name: new FormControl<string | null>('', [Validators.required]),
  nif: new FormControl<string | null>('', [Validators.required]),
  webPage: new FormControl<string | null>(''),
  email: new FormControl<string | null>('', [Validators.required, Validators.email]),
  addresses: new FormArray<FormGroup<AddressFormGroup>>([]),
  mobileNumbers: new FormArray<FormGroup<MobileNumberFormGroup>>([])
}

