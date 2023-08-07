import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Injectable({
  providedIn: 'root'
})
export class TelephoneFormService {

  constructor(private fb: FormBuilder) {}

  getTelephoneForm() {
    return this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6,14}$"), RxwebValidators.unique(
        { message: 'Numero repetido.' }
      )]]
    });
  }
}
