import { Gender } from "./gender";
import { Relationship } from "./relationship";
import { User } from "./user";
import { DeathCause } from './deathCause';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Address, AddressFormGroup, getAddressFormControl } from 'src/app/shared/models/address';
import { RxwebValidators } from "@rxweb/reactive-form-validators";

export interface Deceased {
  id?: number;
  lastName: string;
  firstName?: string;
  dni: number;
  birthDate: number;
  deathDate: number;
  placeOfDeath: Address;
  registerDate: number;
  deceasedRelationship: Relationship;
  deceasedUser: User;
  deceasedGender: Gender;
  deceasedDeathCause: DeathCause;
}

export type DeceasedForm = {
  lastName: FormControl<string>;
  placeOfDeath: FormGroup<AddressFormGroup>;
  firstName: FormControl<string>;
  dni: FormControl<number>;
  birthDate: FormControl<Date>;
  deathDate: FormControl<Date>;
  gender: FormControl<Gender>;
  deceasedRelationship: FormControl<Relationship>;
  deathCause: FormControl<DeathCause>;
};

export function getDeceasedFormControl(): DeceasedForm {
  return Object.freeze({
    firstName: new FormControl<string | null>("", {
      validators: [Validators.required],
    }),
    lastName: new FormControl<string | null>("", {
      validators: [Validators.required],
    }),
    dni: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1),
        RxwebValidators.maxLength({ value: 9 }),
        RxwebValidators.minLength({ value: 6 }),
      ],
    }),
    birthDate: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    deathDate: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    gender: new FormControl<Gender | null>(null, {
      validators: [Validators.required],
    }),
    deceasedRelationship: new FormControl<Relationship | null>(null, {
      validators: [Validators.required],
    }),
    deathCause: new FormControl<DeathCause | null>(null, {
      validators: [Validators.required],
    }),
    placeOfDeath: new FormGroup(getAddressFormControl())
  });
}