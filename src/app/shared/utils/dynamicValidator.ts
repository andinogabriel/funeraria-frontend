import { FormGroup, Validators } from '@angular/forms';

export function dynamicValidator(formValidator: FormGroup, key: string, value: string, valueIsEqualTo: string) {
  if(value.toLowerCase() === valueIsEqualTo?.toLowerCase()) {
    formValidator.get(key)?.setValidators(Validators.required);
    formValidator.get(key)?.updateValueAndValidity();
  } else {
    formValidator.get(key)?.clearValidators();
    formValidator.get(key)?.updateValueAndValidity();
  }
}

