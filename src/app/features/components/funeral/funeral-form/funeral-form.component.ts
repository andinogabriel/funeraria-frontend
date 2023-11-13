import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { interval, merge} from 'rxjs';
import { first } from 'rxjs/operators';
import { FuneralService } from 'src/app/features/services/funeral.service';
import { PlanService } from 'src/app/features/services/plan.service';
import { Funeral, FuneralRequest, getFuneralFormControl } from 'src/app/shared/models/funeral';
import { Plan } from 'src/app/shared/models/plan';
import { ReceiptType } from 'src/app/shared/models/receiptType';
import { SelectInput } from 'src/app/shared/models/selectInput';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ReceiptTypeService } from 'src/app/shared/services/receipt-type.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonFormComponent } from '../../common-form.component';
import { SearchAffiliateComponent } from '../search-affiliate/search-affiliate.component';
import { Affiliate } from 'src/app/features/models/affiliate';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-funeral-form',
  templateUrl: './funeral-form.component.html',
  styleUrls: ['./funeral-form.component.css'],
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
  serializedDate = new FormControl(new Date().toISOString());
  funeralSelectInputs: SelectInput[] = [];
  parentFormGroup!: FormGroup;
  isAdmin: boolean;
  price: number = 0;
  subPrice: number = 0;
  tax: number;

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

  constructor(
    funeralService: FuneralService,
    @Inject(MAT_DIALOG_DATA) public override data: Funeral,
    dialogRef: MatDialogRef<FuneralFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: UntypedFormBuilder,
    private planService: PlanService,
    private receiptTypeService: ReceiptTypeService,
    private dialog: MatDialog,
    private tokenService: TokenService
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
    this.entityForm = new FormGroup(getFuneralFormControl());
    
    this.data ? this.initUpdatePlanForm() : this.initCreatePlanForm();
  
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el funeral.`,
      title: `Error al ${data ? 'editar' : 'crear'} el funeral`
    }
  }

  override ngOnInit(): void {
    setTimeout(() => {
      this.isAdmin = this.tokenService.isAdmin();
      this.getPlans();
      this.getreceiptTypes();
      this.disabledUserRoleInputs();
    });
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    this.priceCalculator();
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  OnDateChange(event: MatDatepickerInputEvent<Date>, itemName: string) {
    this.entityForm?.get(itemName)?.setValue(event);
  }

  searchAffiliate(): void {
    this.dialog.open(SearchAffiliateComponent).afterClosed()
    .pipe(first())
    .subscribe({
      next: (value: Affiliate) => {
        this.entityForm?.get('deceased')?.setValue({
          ...this.entityForm?.get('deceased')?.value,
          birthDate: moment(value.birthDate, 'DD-MM-yyyy').toDate(),
          deceasedRelationship: value.relationship,
          dni: value.dni.toString(),
          firstName: value.firstName,
          gender: value.gender,
          lastName: value.lastName,
        });
      },
      error: (err) => this.snackbarService.error(err?.error?.message ? err?.error?.message : 'Hubo un error al seleccionar el afiliado')
    });
  }

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
              smWidth: '0 1 calc(44% - 15px)', lgWidth: '100%',
              errors: [
                { name: 'required', message: 'El plan es requerido' }
              ]
            }
          ]
        },
        error: (err) => this.snackbarService.error(err?.error?.message ? err?.error?.message : "Hubo un error en obtener los planes de funeral.")
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
              smWidth: '0 1 calc(44% - 15px)', lgWidth: '100%',
              errors: [
                { name: 'required', message: 'El tipo de recibo es requerido' }
              ]
            }
          ]
        },
        error: (err) => this.snackbarService.error(err?.error?.message ? err?.error?.message : "Hubo un error en obtener los tipo. de recibos.")
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
    this.entityInitFormControl = getFuneralFormControl();
  }

  private disabledUserRoleInputs(): void {
    if (!!!this.isAdmin) {
      this.entityForm.controls['receiptNumber'].disable();
      this.entityForm.controls['receiptSeries'].disable();
      this.entityForm.controls['tax'].disable();
      this.entityForm.controls['receiptType'].disable();
    }
  }

  private priceCalculator(): void {
    const DEFAULT_TAX = 21;
    merge(
      this.entityForm.get('tax')?.valueChanges,
      this.entityForm.get('plan')?.valueChanges
    ).subscribe(data => {
      if (typeof data === 'string') {
        this.tax = parseInt(data)
      } else {
        this.subPrice = +data['price'];
      }
      const taxToPrice = this.tax ? this.tax : DEFAULT_TAX;
      this.price = +this.subPrice + ((+this.subPrice * taxToPrice) / 100);
    });
  }

}