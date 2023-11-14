import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { first } from 'rxjs';
import { ItemService } from 'src/app/features/services/item.service';
import { Item } from 'src/app/shared/models/item';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonListComponent } from '../../common.list.component';
import { ItemFormComponent } from './../item-form/item-form.component';


@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent extends CommonListComponent<
Item,
Item,
ItemService
> {



  constructor(service: ItemService, dialogService: ConfirmDialogService, snackbarService: SnackbarService, dialog: MatDialog, titleService: Title, logger: NGXLogger,) {
    super(service,dialogService, snackbarService, dialog, titleService, logger);
    this.entityId = 'code';
    this.modelName = 'Artículos';
    this.deleteSuccessMessage = 'Artículo eliminado satisfactoriamente.';
    this.deleteErrorMessage = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de eliminar el artículo seleccionada.',
      title: 'Error al eliminar el artículo.',
    };
    this.errorGetModelList = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de obtener todas los articulos.',
      title: 'Error al obtener los articulos.',
    };
    this.deleteMessageOptions = {
      confirmText: 'Aceptar',
      message: '¿Estas seguro de eliminar el artículo seleccionada?',
      title: 'Eliminar artículo.',
    };
    this.displayedColumns = [
      {
        name: 'Nombre',
        dataKey: 'name',
        isSortable: true,
      },
      {
        name: 'Descripción',
        dataKey: 'description',
        isSortable: true,
      },
      {
        name: 'Categoría',
        dataKey: 'categoryName',
        isSortable: true,
      },
      {
        name: 'Precio',
        dataKey: 'price',
        isSortable: true,
      },
      {
        name: 'Stock',
        dataKey: 'stock',
        isSortable: true,
      },
      {
        name: 'Marca',
        dataKey: 'brandName',
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
        this.dataSource = modeltList.map(item => ({...item, 'price': +item?.price ? '$' + item.price : '-', 'categoryName': item?.category?.name, 'brandName': item?.brand.name, }))
        this.logger.log(`${this.modelName} cargados.`);
        this.dataFetched = true;
      },
      error: () => this.dialogService.open(this.errorGetModelList),
    });
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource = [{...result?.data, 'categoryName': result?.data?.category?.name, 'brandName': result?.data?.brand?.name}, ...this.dataSource];
      }
    });
  }

  override updateElement(elem: Item): void {
    const dialogRef = this.dialog.open(ItemFormComponent,
      {
        data: elem
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(result?.data?.category?.name.toLowerCase() !== ('ataud' || 'ataúd')) { 
          result.data['itemLength'] = null;
          result.data['itemWidth'] = null;
          result.data['itemHeight'] = null;
        }
        const itemToUpdate = {...result?.data, 'categoryName': result?.data?.category?.name, 'brandName': result?.data?.brand?.name};
        this.dataSource = this.dataSource.map(cat => (cat.code === elem.code) ? itemToUpdate : cat);
      }
    });
  }

}
