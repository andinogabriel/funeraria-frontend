import { Component } from '@angular/core';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { CommonListComponent } from '../../common.list.component';
import { CategoryService } from './../../../services/category.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormComponent } from './../category-form/category-form.component';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent extends CommonListComponent<
  Category,
  Category,
  CategoryService
> {
 
  constructor(service: CategoryService, dialogService: ConfirmDialogService, snackbarService: SnackbarService, dialog: MatDialog, titleService: Title, logger: NGXLogger,) {
    super(service,dialogService, snackbarService, dialog, titleService, logger);
    this.entityId = 'id';
    this.modelName = 'Categorias';
    this.deleteSuccessMessage = 'Categoría eliminada satisfactoriamente.';
    this.deleteErrorMessage = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de eliminar la categoria seleccionada.',
      title: 'Error al eliminar categoría.',
    };
    this.errorGetModelList = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de obtener todas las categorias.',
      title: 'Error al obtener las categorias.',
    };
    this.deleteMessageOptions = {
      confirmText: 'Aceptar',
      message: '¿Estas seguro de eliminar la categoría seleccionada?',
      title: 'Eliminar categoría.',
    };
    this.displayedColumns = [
      {
        name: 'Nombre',
        dataKey: 'name',
        isSortable: true,
      },
      {
        name: 'Descripcion',
        dataKey: 'description',
        isSortable: true,
      },
    ];
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource = [result?.data, ...this.dataSource];
      }
    });
  }

  override updateElement(elem: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent,
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
