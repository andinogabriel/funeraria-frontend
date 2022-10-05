import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { untilDestroyed } from '@ngneat/until-destroy';
import { first, interval } from 'rxjs';
import { IncomeService } from 'src/app/features/services/income.service';
import { SupplierService } from 'src/app/features/services/supplier.service';
import { Category } from 'src/app/shared/models/category';
import { Income, IncomeToShow } from 'src/app/shared/models/income';
import { IncomeDetail } from 'src/app/shared/models/incomeDetail';
import { Item } from 'src/app/shared/models/item';
import { ReceiptType } from 'src/app/shared/models/receiptType';
import { Supplier } from 'src/app/shared/models/supplier';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ReceiptTypeService } from 'src/app/shared/services/receipt-type.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { onlyNumberWithoutDecimal, onlyTwoDecimalRgx } from 'src/app/shared/utils/regex';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.css']
})
export class IncomeFormComponent extends CommonFormComponent<
Income,
IncomeToShow,
IncomeService
> {

  receiptTypes: ReceiptType[] = [];
  suppliers: Supplier[] = [];
  categories: Category[] = [];
  items: Item[] = [];
  itemsForm: Item[] = [];
  price: number = 0;
  percentage: number = null;

  incomeFormInputs = [
    {
      name: 'receiptNumber', label: 'Número de recibo', type: 'number',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El número de recibo es requerido'},
        {name: 'maxLength', message: 'El número de recibo no debe superar los 20 digitos.'},
        {name: 'pattern', message: 'El número de recibo no puede contener decimales.'},
      ]
    },
    {
      name: 'receiptSeries', label: 'Número de serie', type: 'number',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El número de serie es requerido'},
      ]
    },
    {
      name: 'tax', label: 'Impuesto', type: 'number',
      smWidth: '0 1 calc(20% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El impuesto es requerido'},
        {name: 'min', message: 'El impuesto debe ser positivo'},
        {name: 'max', message: 'El impuesto debe ser menor a cien'},
        {name: 'pattern', message: 'El impuesto debe contener solo dos decimales'},
      ]
    },
    
  ]


  constructor(
    incomService: IncomeService,
    @Inject(MAT_DIALOG_DATA) public override data: Income,
    dialogRef: MatDialogRef<IncomeFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: FormBuilder,
    private receiptTypeService: ReceiptTypeService,
    private supplierService: SupplierService
  ) {
    super(
      incomService,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.createdSuccessMessage =  `Detalle de ingreso ${data ? 'editado' : 'creado'} satisfactoriamente.`;
    this.entityForm = new FormGroup({
      receiptNumber: new FormControl(''),
      receiptSeries: new FormControl(''),
      tax: new FormControl(''),
      receiptType: new FormControl(''),
      supplier: new FormControl(''),
      incomeDetails:  new FormArray([])
    });
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el ingreso.`,
      title: `Error al ${data ? 'editar' : 'crear'} el ingreso.`
    }
    if(this.data) {
      this.entityId = this.data?.receiptNumber;
      this.getIncomeDetailsFromUpdate();
      console.log(this.data);
      this.entityForm.get('receiptNumber').disable();
      this.entityForm.get('receiptSeries').disable();
      this.entityInitUpdateFormControl = {
        'receiptNumber': this.data?.receiptNumber ?? null,
        'receiptSeries': this.data?.receiptSeries ?? null,
        'tax': +this.data?.tax ?? null,
        'receiptType': this.data?.receiptType ?? null,
        'supplier': this.data?.supplier ?? null,
      };
    } else {
      this.entityInitFormControl = {
        'receiptNumber': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20), Validators.pattern(onlyNumberWithoutDecimal)]),
        'receiptSeries': new FormControl('', [Validators.required]),
        'tax': new FormControl('', [Validators.required, Validators.min(0), Validators.max(100), Validators.required, Validators.pattern(onlyTwoDecimalRgx)]),
        'receiptType': new FormControl('', [Validators.required]),
        'supplier': new FormControl('', [Validators.required]),
        'incomeDetails':  new FormArray([this.getNewIncomeDetail()]),
      };
    }
  }

  override ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    setTimeout(() => {
      this.getReceiptTypes();
      this.getSuppliers();
    });
    this.priceCalculator();
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  override create(elemToCreate: Income): void {
    this.service.create(elemToCreate).subscribe({
      next: (elemCreated) => {
        this.dialogRef.close({ data: {...elemCreated, 'tax': elemCreated?.tax + '%', 'totalAmount': elemCreated?.totalAmount ? '$' + elemCreated.totalAmount : '0', 'receiptType': elemCreated?.receiptType['name'], 'supplier': elemCreated?.supplier['name']} });
        this.snackbarService.success(this.createdSuccessMessage);
      },
      error: (err) => {
        console.log(err);
        this.dialogService.open(err ? {...this.createdOrUpdateErrorMessage, 'message': err?.error?.message} : this.createdOrUpdateErrorMessage)
      },
    });
  }

  get incomeDetails() {
    return (<FormArray>this.entityForm.get('incomeDetails'));
  }

  addEntryDetail() {
    this.itemsForm = this.incomeDetails?.value.map((value: IncomeDetail) => value['item']);
    this.incomeDetails.push(this.getNewIncomeDetail());
  }

  deleteEntryDetail(entryDetailIndex: number) {
    this.incomeDetails.removeAt(entryDetailIndex);
  }

  private getReceiptTypes(): void {
    this.receiptTypeService.findAll()
    .pipe(first())
    .subscribe({
      next: (receiptTypes) => this.receiptTypes = receiptTypes,
      error: () => console.log('Error al obtener los tipos de recibo.')
    });
  }

  private priceCalculator(): void {
    this.entityForm.valueChanges.subscribe((value: Income) => {
      const pricePorcentage = +value.tax / 100;
      const subTotal = value.incomeDetails.reduce((a, b) => a + ((+b?.quantity ? b.quantity : 0) * (+b.purchasePrice ? +b.purchasePrice : 0)), 0);
      this.price = subTotal + subTotal * pricePorcentage;
    });
  }

  private getSuppliers(): void {
    this.supplierService.findAll()
    .pipe(first())
    .subscribe({
      next: (suppliers) => this.suppliers = suppliers,
      error: () => console.log('Error al obtener los proveedores.')
    });
  }

  private getNewIncomeDetail() { 
    return this.fb.group({
        quantity: [null, [Validators.required, Validators.pattern(onlyNumberWithoutDecimal)]],
        purchasePrice: [null, [Validators.required, Validators.pattern(onlyTwoDecimalRgx)]],
        salePrice: [null, [Validators.required, Validators.pattern(onlyTwoDecimalRgx)]],
        item: [null, Validators.required],
        category: [null, Validators.required],
      });
}

private getIncomeDetailsFromUpdate(): void {
  if(this.data.hasOwnProperty('incomeDetails')) {
    Object.values(this.data?.incomeDetails as IncomeDetail[]).forEach(a => {
      const incomeDetail = this.fb.group({
        category: a?.item.category,
        item: a?.item,
        quantity: a?.quantity,
        purchasePrice: a?.purchasePrice,
        salePrice: a?.salePrice
      });
      this.incomeDetails.push(incomeDetail);
    });
  }
}


}
