import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { first, interval } from 'rxjs';
import { IncomeService } from 'src/app/features/services/income.service';
import { SupplierService } from 'src/app/features/services/supplier.service';
import { Income, IncomeToShow } from 'src/app/shared/models/income';
import { ReceiptType } from 'src/app/shared/models/receiptType';
import { Supplier } from 'src/app/shared/models/supplier';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ReceiptTypeService } from 'src/app/shared/services/receipt-type.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonListComponent } from '../../common.list.component';
import { IncomeFormComponent } from '../income-form/income-form.component';
import { IncomeMoreInfoComponent } from '../income-more-info/income-more-info.component';


@Component({
  selector: 'app-list-incomes',
  templateUrl: './list-incomes.component.html',
  styleUrls: ['./list-incomes.component.css']
})
export class ListIncomesComponent extends CommonListComponent<
Income,
IncomeToShow,
IncomeService
> {

  receiptTypes: ReceiptType[] = [];
  suppliers: Supplier[] = [];

  constructor(service: IncomeService, dialogService: ConfirmDialogService, snackbarService: SnackbarService, dialog: MatDialog, titleService: Title, logger: NGXLogger, private receiptTypeService: ReceiptTypeService, private supplierService: SupplierService) {
    super(service,dialogService, snackbarService, dialog, titleService, logger);
    this.modelName = 'Ingresos';
    this.deleteSuccessMessage = 'Ingreso eliminado satisfactoriamente.';
    this.deleteErrorMessage = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de eliminar el ingreso seleccionado.',
      title: 'Error al eliminar el ingreso.',
    };
    this.errorGetModelList = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de obtener todas los ingresos.',
      title: 'Error al obtener los ingresos.',
    };
    this.deleteMessageOptions = {
      confirmText: 'Aceptar',
      message: '¿Estas seguro de eliminarel ingreso seleccionado?',
      title: 'Eliminar ingreso.',
    };
    this.displayedColumns = [
      {
        name: 'Numero de recibo',
        dataKey: 'receiptNumber',
        isSortable: true,
      },
      {
        name: 'Numero de serie',
        dataKey: 'receiptSeries',
        isSortable: true,
      },
      {
        name: 'Fecha',
        dataKey: 'incomeDate',
        isSortable: true,
      },
      {
        name: 'Impuesto',
        dataKey: 'tax',
        isSortable: true,
      },
      {
        name: 'Monto',
        dataKey: 'totalAmount',
        isSortable: true,
      },
      {
        name: 'Proveedor',
        dataKey: 'supplier',
        isSortable: true,
      },
      {
        name: 'Tipo de recibo',
        dataKey: 'receiptType',
        isSortable: true,
      },
    ];
  }

  override getModelList(): void {
    this.service
    .findAll()
    .pipe(first())
    .subscribe({
      next: (modeltList) => {
        this.dataSource = modeltList.map(item => ({...item, 'tax': item?.tax + '%', 'totalAmount': item?.totalAmount ? '$' + item.totalAmount : '0', 'receiptType': item?.receiptType['name'], 'supplier': item?.supplier['name']}))
        this.logger.log(`${this.modelName} cargados.`)
      },
      error: () => this.dialogService.open(this.errorGetModelList),
    });
  }

  override ngOnInit(): void {
    this.getModelList();;
    interval(1000).pipe(untilDestroyed(this)).subscribe();
    setTimeout(() => {
      this.getReceiptTypes();
      this.getSuppliers();
    });
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(IncomeFormComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource = [result?.data, ...this.dataSource];
      }
    });
  }

  override updateElement(elem: IncomeToShow): void {
    const receiptTypeObject = this.receiptTypes.find(r => r.name === elem.receiptType);
    const supplierObject = this.suppliers.find(s => s.name === elem.supplier);
    const taxNumber = parseFloat(elem.tax.slice(0, -1));
    const totalAmountNumber = parseFloat(elem.totalAmount.substring(1));
    const dialogRef = this.dialog.open(IncomeFormComponent,
      {
        data: {...elem, 'receiptType': receiptTypeObject, 'entrySupplier': supplierObject, 'tax': taxNumber, 'totalAmount': totalAmountNumber}
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        const incomeUpdated = {...result.data, 'entrySupplier': result.data?.entrySupplier?.name, 'receiptType': result.data?.receiptType?.name, 'tax': result.data?.tax + '%'}
        this.dataSource = this.dataSource.map(income => (income.id === elem.id) ? incomeUpdated : income);
      }
    });
  }

  override showMoreInfo(elem: Income): void {
    console.log(elem);
    this.dialog.open(IncomeMoreInfoComponent, { data: elem });
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

}
