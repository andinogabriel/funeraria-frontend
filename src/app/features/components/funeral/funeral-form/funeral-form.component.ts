import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { untilDestroyed } from '@ngneat/until-destroy';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { interval} from 'rxjs';
import { first } from 'rxjs/operators';
import { FuneralService } from 'src/app/features/services/funeral.service';
import { PlanService } from 'src/app/features/services/plan.service';
import { Funeral, FuneralRequest } from 'src/app/shared/models/funeral';
import { Plan } from 'src/app/shared/models/plan';
import { ReceiptType } from 'src/app/shared/models/receiptType';
import { SelectInput } from 'src/app/shared/models/selectInput';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ReceiptTypeService } from 'src/app/shared/services/receipt-type.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { onlyTwoDecimalRgx } from 'src/app/shared/utils/regex';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-funeral-form',
  templateUrl: './funeral-form.component.html',
  styleUrls: ['./funeral-form.component.css']
})
export class FuneralFormComponent extends CommonFormComponent<
FuneralRequest,
Funeral,
FuneralService
> {

  plans: Plan[] = [];
  receiptTypes: ReceiptType[] = [];
  maxDate: Date;
  minDate: Date;
  deceasedForm: FormGroup;
  serializedDate = new FormControl(new Date().toISOString());

  funeralSelectInputs: SelectInput[] = [];

  funeralFormInputs = [
    {
      name: 'receiptNumber', label: 'Número de Recibo', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El Número de recibo es requerido'}
      ]
    },
    {
      name: 'receiptSeries', label: 'Número de Serie', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El Número de serie es requerido'}
      ]
    },
    {
      name: 'tax', label: 'Impuesto', type: 'number',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El impuesto es requerido'},
        {name: 'min', message: 'El impuesto debe ser positivo'},
        {name: 'pattern', message: 'El impuesto solo debe contener dos decimales'}
      ]
    }
  ];

  deceasedInputs = [
    {
      name: 'firstName', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El Nombre es requerido'}
      ]
    },
    {
      name: 'lastName', label: 'Apellido', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El Apellido es requerido'}
      ]
    },
    {
      name: 'dni', label: 'Dni', type: 'number',
      smWidth: '0 1 calc(33% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El dni es requerido'},
        {name: 'maxLength', message: 'El dni solo puede tener 9 digitos'},
        {name: 'minLength', message: 'El dni debe tener al menos 6 digitos'}
      ]
    },
  ]

  datesForm = [
    {
      name: 'birthDate', label: 'Fecha de nac.', dateMin: new Date(new Date().getFullYear() - 130, 0, 1), dateMax: new Date(), errors: [
        {name: 'required', message: 'La fecha de nac es requerida'},
      ]
    },
    {
      name: 'deathDate', label: 'Fecha de deceso', dateMax: new Date(), 
      dateMin: new Date(
        new Date().getFullYear(), 
        new Date().getMonth(),
        new Date().getDate() - 10
      ),
      errors: [
        {name: 'required', message: 'La fecha de deceso es requerida'},
      ]
    }
  ]

  constructor(
    funeralService: FuneralService,
    @Inject(MAT_DIALOG_DATA) public override data: Funeral,
    dialogRef: MatDialogRef<FuneralFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: UntypedFormBuilder,
    private planService: PlanService,
    private receiptTypeService: ReceiptTypeService,
  ) {
    super(
      funeralService,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.maxDate = new Date(
      new Date().getMonth() === 12 && new Date().getDate() > 25 ? new Date().getFullYear() + 1 :  new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate() + 5);
    this.minDate = new Date();
    this.createdSuccessMessage = `Funeral ${data ? 'editado' : 'creado'} satisfactoriamente.`;
    this.entityForm = new FormGroup(this.getCreateFormControl());
    
    this.data ? this.initUpdatePlanForm() : this.initCreatePlanForm();
  
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el funeral.`,
      title: `Error al ${data ? 'editar' : 'crear'} el funeral`
    }
  }

  override ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    setTimeout(() => {
      this.getPlans();
      this.getreceiptTypes();
    });
    //this.priceCalculator();
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  OnDateChange(event: MatDatepickerInputEvent<Date>, itemName: string) {
    itemName !== 'funeralDate' 
      ? this.entityForm.get?.('deceased').get(itemName).setValue(event)
      : this.entityForm?.get(itemName)?.setValue(event);
  }

  /*public hasError = (controlName: string, errorName: string): boolean => {
    return this.deceasedForm?.controls[controlName].hasError(errorName);
  };*/

  private getPlans(): void {
    this.planService.findAll()
      .pipe(first())
      .subscribe({
        next: (plans: Plan[]) => {
          this.plans = plans;
          this.funeralSelectInputs = [...this.funeralSelectInputs, 
            {
              name: 'plan', label: 'Plan',
              items: this.plans,
              smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
              errors: [
                { name: 'required', message: 'El plan es requerido' }
              ]
            }
          ]
        },
        error: (error) => console.log(error?.error)
    });
  }

  private getreceiptTypes(): void {
    this.receiptTypeService.findAll()
      .pipe(first())
      .subscribe({
        next: (receiptTypes: ReceiptType[]) => {
          this.receiptTypes = receiptTypes;
          this.funeralSelectInputs = [...this.funeralSelectInputs, 
            {
              name: 'receiptType', label: 'Tipo de recibo',
              items: this.receiptTypes,
              smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
              errors: [
                { name: 'required', message: 'El tipo de recibo es requerido' }
              ]
            }
          ]
        },
        error: (error) => console.log(error?.error)
    });
  }


  private initUpdatePlanForm(): void {
    this.entityId = this.data?.id;
    this.entityInitUpdateFormControl = {
      receiptNumber: this.data?.receiptNumber ?? null,
      receiptSeries: this.data?.receiptSeries ?? null,
      tax: this.data?.tax ?? null,
      funeralDate:  new Date(moment(this.data?.funeralDate, "DD-MM-YYYY").toDate()) ?? null,
      receiptType: this.data?.receiptType ?? null,
      deceased: this.data?.deceased ?? null,
      plan: this.data?.plan ?? null
    };
  }

  private initCreatePlanForm(): void {
    this.entityInitFormControl = this.getCreateFormControl();
  }

  private getCreateFormControl(): any {
    return {
      funeralDate: new FormControl<Date | null>(new Date(), [Validators.required]),
      receiptNumber: new FormControl<string | null>('', [Validators.required]),
      receiptSeries: new FormControl<string | null>('', [Validators.required]),
      tax: new FormControl<number | null>(null, [Validators.required, RxwebValidators.digit(), Validators.pattern(onlyTwoDecimalRgx), Validators.min(1)]),
      receiptType:  new FormControl<ReceiptType | null>(null, [Validators.required]),
      deceased: new FormGroup<DeceasedForm>({
        lastName: new FormControl<string | null>("", {
          validators: [Validators.required]
        }),
        firstName: new FormControl<string | null>("", {
          validators: [Validators.required]
        }),
        dni: new FormControl<number | null>(null, {
          validators: [Validators.required, Validators.min(1), RxwebValidators.maxLength({value:9 }),RxwebValidators.minLength({value:6 })]
        }),
        birthDate: new FormControl<Date | null>(null, {
          validators: [Validators.required]
        }),
        deathDate: new FormControl<Date | null>(null, {
          validators: [Validators.required]
        }),
      }),
      plan:  new FormControl<Plan | null>(null, [Validators.required]),
    };
  }


}


type DeceasedForm = {
  lastName: FormControl<string>;
  placeOfDeath?: FormControl<any | null>;
  firstName: FormControl<string>;
  dni: FormControl<number>;
  birthDate: FormControl<Date>;
  deathDate: FormControl<Date>;
};
