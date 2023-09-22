import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { first } from 'rxjs';
import { PlanService } from 'src/app/features/services/plan.service';
import { ItemsPlan } from 'src/app/shared/models/itemsPlan';
import { Plan } from 'src/app/shared/models/plan';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonListComponent } from '../../common.list.component';
import { PlanFormComponent } from '../plan-form/plan-form.component';
import { PlanMoreInfoComponent } from '../plan-more-info/plan-more-info.component';

@Component({
  selector: 'app-list-plans',
  templateUrl: './list-plans.component.html',
  styleUrls: ['./list-plans.component.css']
})
export class ListPlansComponent extends CommonListComponent<
Plan,
Plan,
PlanService
> {

  constructor(service: PlanService, dialogService: ConfirmDialogService, snackbarService: SnackbarService, dialog: MatDialog, titleService: Title, logger: NGXLogger,) {
    super(service,dialogService, snackbarService, dialog, titleService, logger);
    this.entityId = 'id';
    this.modelName = 'Planes';
    this.deleteSuccessMessage = 'Plan eliminado satisfactoriamente.';
    this.deleteErrorMessage = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de eliminar el plan seleccionada.',
      title: 'Error al eliminar el plan.',
    };
    this.errorGetModelList = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de obtener todas los planes.',
      title: 'Error al obtener los planes.',
    };
    this.deleteMessageOptions = {
      confirmText: 'Aceptar',
      message: '¿Estas seguro de eliminar el plan seleccionada?',
      title: 'Eliminar plan.',
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
        isSortable: false,
      },
      {
        name: 'Cant. de artículos',
        dataKey: 'numberOfItems',
        isSortable: true,
      },
      {
        name: 'Precio',
        dataKey: 'price',
        isSortable: true,
      }
    ];
  }

  override getModelList(): void {
    this.service
    .findAll()
    .pipe(first())
    .subscribe({
      next: (modeltList) => {
        this.dataSource = modeltList.map(plan => ({...plan, 'numberOfItems': this.getItemsQuantity(plan?.itemsPlan), 'price': '$'+plan?.price}));
        this.logger.log(`${this.modelName} cargados.`);
        this.dataFetched = true;
      },
      error: () => this.dialogService.open(this.errorGetModelList),
    });
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(PlanFormComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource = [{...result?.data, 'numberOfItems': this.getItemsQuantity(result?.data?.itemsPlan)}, ...this.dataSource];
      }
    });
  }

  override updateElement(elem: Plan): void {
    const dialogRef = this.dialog.open(PlanFormComponent,
      {
        data: {...elem, 'price': elem.price.toString().substring(1)}
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        const planUpdated = result?.data as Plan;
        this.dataSource = this.dataSource.map(plan => (plan.id === elem.id) ? {...planUpdated, 'price': '$' + planUpdated.price, 'numberOfItems': this.getItemsQuantity(planUpdated.itemsPlan)} : plan);
      }
    });
  }

  override showMoreInfo(elem: Plan): void {
    this.dialog.open(PlanMoreInfoComponent, { data: elem });
  }

  private getItemsQuantity(itemsPlan: ItemsPlan[]): number {
    return itemsPlan.reduce((sum, itemPlan) => sum + itemPlan.quantity, 0);
  }

}
