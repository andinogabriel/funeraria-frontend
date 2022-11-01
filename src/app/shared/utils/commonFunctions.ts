import { AbstractControl, AsyncValidatorFn, UntypedFormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { delay, map, Observable, of } from 'rxjs';
import { Item } from '../models/item';
import { MobileNumber } from '../models/mobileNumber';


export const filterAlreadySelectedItems = (items: Item[], itemsFormGroup: Item[]) => (
  items.filter(val => !itemsFormGroup.includes(val))
);

export const isMobileNumberDuplicated = () => {
  const validator: ValidatorFn = (formArray: UntypedFormArray) => {  
    const mobileNumbers: MobileNumber[] = formArray.controls.map(control => control.value);
    const mobNumbers = mobileNumbers.map(value => value.mobileNumber)
    const hasDuplicate = mobNumbers.some(
      (number, index) => mobNumbers.indexOf(number, index + 1) != -1
    );  
    return hasDuplicate ? { duplicate: true } : null;
  }
  return validator;
}

export const checkIfUsernameExists = (value: string, mobileNumbers: MobileNumber[]) => {
  return of(mobileNumbers.some((a) => a.mobileNumber === value)).pipe(
    delay(500)
  );
}

export function containsDuplicates(array: any) {
  if (array.length !== new Set(array).size) {
    return true;
  }
  return false;
}

export function getAge(birthDate: string): number {
  return (moment().year() - moment(birthDate, 'DD-MM-YYYY').year());
}

