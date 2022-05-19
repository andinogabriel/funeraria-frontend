import { Injectable } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class AddressFormService {
  constructor(private fb: FormBuilder) {}

  getAddressForm() {
    return this.fb.group({
      streetName: ['', Validators.required],
      city: ['', Validators.required],
      province: [''],
      apartment: [''],
      blockStreet: [''],
      flat: [''],
    });
  }
}
