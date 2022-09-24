import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';



export function dynamicValidator(formValidator: FormGroup, key: string, value: string, valueIsEqualTo: string, minMax?: boolean, minValue?: number, maxValue?: number) {
  if(value?.toLowerCase() === valueIsEqualTo?.toLowerCase()) {
    formValidator.get(key)?.setValidators([Validators.required, Validators.pattern('^[0-9]\\d*(\\.\\d{1,2})?$')]);
    if(minMax !== undefined && minMax !== null && minMax) {
      formValidator.get(key)?.setValidators([Validators.required, Validators.pattern('^[0-9]\\d*(\\.\\d{1,2})?$'), Validators.min(minValue), Validators.max(maxValue)]);
    }
    formValidator.get(key)?.updateValueAndValidity();
  } else {
    formValidator.get(key)?.clearValidators();
    formValidator.get(key)?.updateValueAndValidity();
  }
}

export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  };
}

