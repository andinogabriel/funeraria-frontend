import { Component, Inject } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { untilDestroyed } from "@ngneat/until-destroy";
import { first, interval } from "rxjs";
import { IncomeService } from "src/app/features/services/income.service";
import { SupplierService } from "src/app/features/services/supplier.service";
import { Category } from "src/app/shared/models/category";
import {
  INCOME_FORM_CONTROL,
  Income,
  IncomeToShow,
} from "src/app/shared/models/income";
import {
  INCOME_DETAIL_FORM_CONTROL,
  IncomeDetail,
} from "src/app/shared/models/incomeDetail";
import { Item } from "src/app/shared/models/item";
import { ReceiptType } from "src/app/shared/models/receiptType";
import { Supplier } from "src/app/shared/models/supplier";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import { ReceiptTypeService } from "src/app/shared/services/receipt-type.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { onlyTwoDecimalRgx } from "src/app/shared/utils/regex";
import { CommonFormComponent } from "../../common-form.component";

@Component({
  selector: "app-income-form",
  templateUrl: "./income-form.component.html",
  styleUrls: ["./income-form.component.css"],
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
      name: "receiptNumber",
      label: "Número de recibo",
      type: "number",
      smWidth: "0 1 calc(50% - 15px)",
      lgWidth: "100%",
      showInCreate: !!!this.data,
      errors: [],
    },
    {
      name: "receiptSeries",
      label: "Número de serie",
      type: "number",
      smWidth: "0 1 calc(50% - 15px)",
      lgWidth: "100%",
      showInCreate: !!!this.data,
      errors: [],
    },
    {
      name: "tax",
      label: "Impuesto",
      type: "number",
      smWidth: "0 1 calc(20% - 15px)",
      lgWidth: "100%",
      errors: [
        { name: "required", message: "El impuesto es requerido" },
        { name: "min", message: "El impuesto debe ser positivo" },
        { name: "max", message: "El impuesto debe ser menor a cien" },
        {
          name: "pattern",
          message: "El impuesto debe contener solo dos decimales",
        },
      ],
    },
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
    super(incomService, data, dialogRef, snackbarService, dialogService, fb);
    this.createdSuccessMessage = `Detalle de ingreso ${
      data ? "editado" : "creado"
    } satisfactoriamente.`;
    this.entityForm = new FormGroup(INCOME_FORM_CONTROL);
    this.createdOrUpdateErrorMessage = {
      confirmText: "Aceptar",
      message: `Ha sucedido un error al intentar ${
        data ? "editar" : "crear"
      } el ingreso.`,
      title: `Error al ${data ? "editar" : "crear"} el ingreso.`,
    };
    this.data ? this.initUpdateIncome() : this.initCreateIncome();
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
        this.dialogRef.close({
          data: {
            ...elemCreated,
            tax: elemCreated?.tax + "%",
            totalAmount: elemCreated?.totalAmount
              ? "$" + elemCreated.totalAmount
              : "0",
            receiptType: elemCreated?.receiptType["name"],
            supplier: elemCreated?.supplier["name"],
          },
        });
        this.snackbarService.success(this.createdSuccessMessage);
      },
      error: (err) => {
        this.dialogService.open(
          err
            ? {
                ...this.createdOrUpdateErrorMessage,
                message: err?.error?.message,
              }
            : this.createdOrUpdateErrorMessage
        );
      },
    });
  }

  get incomeDetails(): FormArray {
    return <FormArray>this.entityForm.get("incomeDetails");
  }

  addEntryDetail() {
    this.itemsForm = this.incomeDetails?.value.map(
      (value: IncomeDetail) => value["item"]
    );
    this.incomeDetails.push(this.getNewIncomeDetail());
  }

  deleteEntryDetail(entryDetailIndex: number) {
    this.incomeDetails.removeAt(entryDetailIndex);
  }

  private initUpdateIncome(): void {
    this.entityId = this.data?.receiptNumber;
    this.getIncomeDetailsFromUpdate();
    this.entityForm.get("receiptNumber").disable();
    this.entityForm.get("receiptSeries").disable();
    this.entityInitUpdateFormControl = {
      receiptNumber: this.data?.receiptNumber ?? null,
      receiptSeries: this.data?.receiptSeries ?? null,
      tax: +this.data?.tax ?? null,
      receiptType: this.data?.receiptType ?? null,
      supplier: this.data?.supplier ?? null,
    };
  }

  private initCreateIncome(): void {
    this.entityInitFormControl = {
      receiptNumber: new FormControl(null),
      receiptSeries: new FormControl(null),
      tax: new FormControl(null, [
        Validators.min(0),
        Validators.max(100),
        Validators.required,
        Validators.pattern(onlyTwoDecimalRgx),
      ]),
      receiptType: new FormControl(null, [Validators.required]),
      supplier: new FormControl(null, [Validators.required]),
      incomeDetails: new FormArray([this.getNewIncomeDetail()]),
    };
  }

  private getReceiptTypes(): void {
    this.receiptTypeService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (receiptTypes) => (this.receiptTypes = receiptTypes),
        error: () => console.log("Error al obtener los tipos de recibo."),
      });
  }

  private priceCalculator(): void {
    this.entityForm.valueChanges.subscribe((value: Income) => {
      const pricePorcentage = +value.tax / 100;
      const subTotal = value.incomeDetails.reduce(
        (a, b) =>
          a +
          (+b?.quantity ? b.quantity : 0) *
            (+b.purchasePrice ? +b.purchasePrice : 0),
        0
      );
      this.price = subTotal + subTotal * pricePorcentage;
    });
  }

  private getSuppliers(): void {
    this.supplierService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (suppliers) => (this.suppliers = suppliers),
        error: () => console.log("Error al obtener los proveedores."),
      });
  }

  private getNewIncomeDetail() {
    return this.fb.group(INCOME_DETAIL_FORM_CONTROL);
  }

  private getIncomeDetailsFromUpdate(): void {
    if (this.data.hasOwnProperty("incomeDetails")) {
      this.incomeDetails.clear();
      Object.values(this.data?.incomeDetails as IncomeDetail[]).forEach((a) => {
        const incomeDetail = this.fb.group({
          category: a?.item.category,
          item: a?.item,
          quantity: a?.quantity,
          purchasePrice: a?.purchasePrice,
          salePrice: a?.salePrice,
        });
        this.incomeDetails.push(incomeDetail);
      });
    }
  }
}
