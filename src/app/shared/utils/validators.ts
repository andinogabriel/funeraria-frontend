import { UntypedFormGroup, Validators } from '@angular/forms';
import { onlyTwoDecimalRgx } from './regex';


export function dynamicValidator(formValidator: UntypedFormGroup, key: string, value: string, possibleValues: string[], minMax?: boolean, minValue?: number, maxValue?: number) {
  const control = formValidator.get(key);
  if (!control) return;
  
  const validators = [];
  if (possibleValues.includes(value?.toLowerCase())) {
    validators.push(Validators.required);
    if (minMax) {
      validators.push(Validators.pattern(onlyTwoDecimalRgx), Validators.min(minValue), Validators.max(maxValue));
    }
  }

  control.setValidators(validators);
  control.updateValueAndValidity();
}

export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
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

