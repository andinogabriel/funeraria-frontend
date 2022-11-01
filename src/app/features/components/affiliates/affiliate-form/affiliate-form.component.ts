import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { untilDestroyed } from '@ngneat/until-destroy';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { first, interval } from 'rxjs';
import { Affiliate } from 'src/app/features/models/affiliate';
import { AffiliateService } from 'src/app/features/services/affiliate.service';
import { Gender } from 'src/app/shared/models/gender';
import { Relationship } from 'src/app/shared/models/relationship';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { GenderService } from 'src/app/shared/services/gender.service';
import { RelationshipService } from 'src/app/shared/services/relationship.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.css']
})
export class AffiliateFormComponent extends CommonFormComponent<
Affiliate,
Affiliate,
AffiliateService
> {

  genders: Gender[] = [];
  relationships: Relationship[] = [];
  maxDate: Date;
  minDate: Date;
  serializedDate = new FormControl(new Date().toISOString());
  affiliateFormInputs = [
    {
      name: 'lastName', label: 'Apellido', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El apellido es requerido'}
      ]
    },
    {
      name: 'firstName', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre es requerido'}
      ]
    },
    {
      name: 'dni', label: 'Dni', type: 'number',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El DNI es requerido'},
        {name: 'pattern', message: 'El DNI debe tener entre 6 y 9 digitos'}
      ]
    },
  ]

  constructor(
    service: AffiliateService,
    @Inject(MAT_DIALOG_DATA) public override data: Affiliate,
    dialogRef: MatDialogRef<AffiliateFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: UntypedFormBuilder,
    private genderService: GenderService,
    private relationshipService: RelationshipService
  ) {
    super(
      service,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.maxDate = new Date();
    this.minDate = new Date(new Date().getFullYear() - 130, 0, 1);
    this.createdSuccessMessage =  `Afiliado ${data ? 'editado' : 'creado'} satisfactoriamente.`;
    this.entityForm = new FormGroup({
      firstName: new FormControl<string | null>(''),
      lastName: new FormControl<string | null>(''),
      birthDate: new FormControl<Date | null>(null),
      dni: new FormControl<number | null>(null),
      relationship: new FormControl<Relationship | null>(null),
      gender: new FormControl<Gender | null>(null),
    });
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el afiliado.`,
      title: `Error al ${data ? 'editar' : 'crear'} el afiliado.`
    }
    if(this.data) {
      this.entityId = this.data?.dni;
      this.entityInitUpdateFormControl = {
        firstName: this.data?.firstName ?? null,
        lastName: this.data?.lastName ?? null,
        birthDate: new Date(moment(this.data.birthDate, "DD-MM-YYYY").toDate()) ?? null,
        dni: this.data?.dni ?? null,
        relationship: this.data?.relationship ?? null,
        gender: this.data?.gender ?? null
      };
    } else {
      this.entityInitFormControl = {
        firstName: new FormControl<string | null>('', [Validators.required]),
        lastName: new FormControl<string | null>('', [Validators.required]),
        birthDate: new FormControl<Date | null>(null, [Validators.required]),
        dni: new FormControl<number | null>(null, [Validators.required, RxwebValidators.digit(), Validators.pattern('^[0-9]{6,9}$')]),
        relationship: new FormControl<Relationship | null>(null, [Validators.required]),
        gender: new FormControl<Relationship | null>(null, [Validators.required])
      };
    }
  }

  override ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    setTimeout(() => {
      this.getGenders();
      this.getRelationships();
    });
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  OnDateChange(event: MatDatepickerInputEvent<Date>) {
    this.entityForm.get('birthDate').setValue(event);
  }

  private getGenders() {
    this.genderService.findAll().pipe(first()).subscribe({
      next: (genders) => this.genders = genders,
      error: () => console.log('Error al obtener los generos.')
    });
  }

  private getRelationships() {
    this.relationshipService.findAll().pipe(first()).subscribe({
      next: (relationships) => this.relationships = relationships,
      error: () => console.log('Error al obtener los parentescos.')
    });
  }

}
