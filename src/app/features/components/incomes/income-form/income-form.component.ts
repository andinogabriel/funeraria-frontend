import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { untilDestroyed } from '@ngneat/until-destroy';
import { first, interval } from 'rxjs';
import { CategoryService } from 'src/app/features/services/category.service';
import { IncomeService } from 'src/app/features/services/income.service';
import { ItemService } from 'src/app/features/services/item.service';
import { SupplierService } from 'src/app/features/services/supplier.service';
import { Category } from 'src/app/shared/models/category';
import { Income, IncomeToShow } from 'src/app/shared/models/income';
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
  incomeFormInputs = [
    {matLabel: 'Número de recibo', type: 'number', name: 'receiptNumber', hasInputError: true, matError: 'El número de recibo es requerido.', tamFlex: '0 1 calc(50% - 15px)', hasAnotherInputError: false},
    {matLabel: 'Número de serie', type: 'number', name: 'receiptSeries', hasInputError: true, matError: 'El número de serie es requerido.', tamFlex: '0 1 calc(50% - 15px)', hasAnotherInputError: false},
    {matLabel: 'Impuesto', type: 'number', name: 'tax', hasInputError: true, matError: 'El impuesto es requerido.', tamFlex: '0 1 calc(20% - 15px)', hasAnotherInputError: true, minErrorMsg: 'El impuesto debe ser mayor a 0.', maxErrorMsg: 'El impuesto no puede superar 100.', patternErrorMsg: 'Solo se permiten dos decimales.'}
  ];

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
      entryDetails:  new FormArray([])
    });
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el ingreso.`,
      title: `Error al ${data ? 'editar' : 'crear'} el ingreso.`
    }
    if(this.data) {
      this.entityId = this.data?.id;
      this.entityInitUpdateFormControl = {
        'receiptNumber': this.data?.receiptNumber ?? null,
        'receiptSeries': this.data?.receiptSeries ?? null,
        'tax': this.data?.tax ?? null,
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
        'entryDetails':  new FormArray([this.newEntryDetail]),
      };
    }
  }

  override ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    setTimeout(() => {
      this.getReceiptTypes();
      this.getSuppliers();
    });
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  get entryDetails() {
    return (<FormArray>this.entityForm.get('entryDetails'));
  }

  addEntryDetail() {
    this.entryDetails.push(this.newEntryDetail);
  }

  deleteEntryDetail(entryDetailIndex: number) {
    this.entryDetails.removeAt(entryDetailIndex);
  }

  private getReceiptTypes(): void {
    this.receiptTypeService.findAll()
    .pipe(first())
    .subscribe({
      next: (receiptTypes) => this.receiptTypes = receiptTypes,
      error: () => console.log('Error al obtener los tipos de recibo.')
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

  private readonly newEntryDetail = this.fb.group({
    quantity: [null, [Validators.required, Validators.pattern(onlyNumberWithoutDecimal)]],
    purchasePrice: [null, [Validators.required, Validators.pattern(onlyTwoDecimalRgx)]],
    salePrice: [null, [Validators.required, Validators.pattern(onlyTwoDecimalRgx)]],
    item: [null, Validators.required],
    category: [null, Validators.required],
  });


}
