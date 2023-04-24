import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Relationship } from "./relationship";
import { DeathCause } from "./deathCause";
import { Gender } from "./gender";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { AddressFormGroup, getAddressFormControl } from "./address";

export type DeceasedForm = {
  lastName: FormControl<string>;
  placeOfDeath: FormGroup<AddressFormGroup>;
  firstName: FormControl<string>;
  dni: FormControl<number>;
  birthDate: FormControl<Date>;
  deathDate: FormControl<Date>;
  gender: FormControl<Gender>;
  userRelationship: FormControl<Relationship>;
  deathCause: FormControl<DeathCause>;
};

export function getDeceasedFormControl(): DeceasedForm {
  return {
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
    userRelationship: new FormControl<Relationship | null>(null, {
      validators: [Validators.required],
    }),
    deathCause: new FormControl<DeathCause | null>(null, {
      validators: [Validators.required],
    }),
    placeOfDeath: new FormGroup(getAddressFormControl())
  };
}

