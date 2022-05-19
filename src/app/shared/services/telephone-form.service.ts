import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TelephoneFormService {

  constructor(private fb: FormBuilder) {}

  getTelephoneForm() {
    return this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6,14}$")]]
    });
  }
}
