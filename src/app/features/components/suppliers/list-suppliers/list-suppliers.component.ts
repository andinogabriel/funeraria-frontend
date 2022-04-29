import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { SupplierService } from 'src/app/features/services/supplier.service';
import { Supplier } from 'src/app/shared/models/supplier';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonListComponent } from '../../common.list.component';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.css']
})
export class ListSuppliersComponent extends CommonListComponent<
Supplier,
Supplier,
SupplierService
> {

  constructor(service: SupplierService, dialogService: ConfirmDialogService, snackbarService: SnackbarService, dialog: MatDialog, titleService: Title, logger: NGXLogger,) {
    super(service,dialogService, snackbarService, dialog, titleService, logger);
    this.modelName = 'Proveedores';
    this.deleteSuccessMessage = 'Proveedor eliminado satisfactoriamente.';
    this.deleteErrorMessage = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de eliminar el proveedor seleccionada.',
      title: 'Error al eliminar el proveedor.',
    };
    this.errorGetModelList = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de obtener todas los proveedores.',
      title: 'Error al obtener los proveedores.',
    };
    this.deleteMessageOptions = {
      confirmText: 'Aceptar',
      message: '¿Estas seguro de eliminar el proveedor seleccionada?',
      title: 'Eliminar proveedor.',
    };
    this.displayedColumns = [
      {
        name: 'Nombre',
        dataKey: 'name',
        isSortable: true,
      },
      {
        name: 'NIF',
        dataKey: 'nif',
        isSortable: true,
      },
      {
        name: 'Email',
        dataKey: 'email',
        isSortable: true,
      },
      {
        name: 'Página web',
        dataKey: 'webPage',
        isSortable: true,
      }
    ];
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(SupplierFormComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource = [result?.data, ...this.dataSource];
      }
    });
  }

  override updateElement(elem: Supplier): void {
    const dialogRef = this.dialog.open(SupplierFormComponent,
      {
        data: elem
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource = this.dataSource.map(cat => (cat.id === elem.id) ? result.data : cat);
      }
    });
  }

}
