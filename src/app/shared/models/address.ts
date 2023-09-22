import { FormControl, FormGroup, Validators } from '@angular/forms';
import { City } from './city';
import { Province } from './province';

export interface Address {
  id?: number;
  streetName: string;
  blockStreet: number;
  apartment: string;
  flat: string;
  city: City;
}

export type AddressFormGroup = {
  streetName: FormControl<string>;
  apartment: FormControl<string>;
  flat: FormControl<string>;
  city: FormControl<City>;
  blockStreet: FormControl<number>;
  province: FormControl<Province>;
}

export function getAddressFormControl(): AddressFormGroup {
    return {
      streetName: new FormControl<string | null>("", {
        validators: [Validators.required],
        updateOn: 'submit'
      }),
      flat: new FormControl<string | null>("", {}),
      blockStreet: new FormControl<number | null>(null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }),
      city: new FormControl<City | null>(null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }),
      apartment: new FormControl<string | null>('', {}),
      province: new FormControl<Province | null>(null, {}),
    };
}