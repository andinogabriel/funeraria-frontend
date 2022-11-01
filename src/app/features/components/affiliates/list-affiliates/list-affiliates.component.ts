import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { first } from 'rxjs';
import { Affiliate } from 'src/app/features/models/affiliate';
import { AffiliateService } from 'src/app/features/services/affiliate.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { getAge } from 'src/app/shared/utils/commonFunctions';
import { CommonListComponent } from '../../common.list.component';
import { AffiliateFormComponent } from '../affiliate-form/affiliate-form.component';
import { AffiliateMoreInfoComponent } from '../affiliate-more-info/affiliate-more-info.component';

@Component({
  selector: 'app-list-affiliates',
  templateUrl: './list-affiliates.component.html',
  styleUrls: ['./list-affiliates.component.css']
})
export class ListAffiliatesComponent extends CommonListComponent<
Affiliate,
Affiliate,
AffiliateService
> {

  constructor(service: AffiliateService, dialogService: ConfirmDialogService, snackbarService: SnackbarService, dialog: MatDialog, titleService: Title, logger: NGXLogger,) {
    super(service,dialogService, snackbarService, dialog, titleService, logger);
    this.entityId = 'dni';
    this.modelName = 'Afiliados';
    this.deleteSuccessMessage = 'Afiliado eliminado satisfactoriamente.';
    this.deleteErrorMessage = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de eliminar el afiliado seleccionada.',
      title: 'Error al eliminar afiliado.',
    };
    this.errorGetModelList = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de obtener todos los afiliados.',
      title: 'Error al obtener los afiliados.',
    };
    this.deleteMessageOptions = {
      confirmText: 'Aceptar',
      message: '¿Estas seguro de eliminar el afiliado seleccionado?',
      title: 'Eliminar afiliado.',
    };
    this.displayedColumns = [
      {
        name: 'Apellido',
        dataKey: 'lastName',
        isSortable: true,
      },
      {
        name: 'Nombre',
        dataKey: 'firstName',
        isSortable: true,
      },
      {
        name: 'Dni',
        dataKey: 'dni',
        isSortable: true,
      },
      {
        name: 'Edad',
        dataKey: 'age',
        isSortable: true,
      },
      {
        name: 'Afiliador',
        dataKey: 'affiliator',
        isSortable: true,
      },
      {
        name: 'Parentesco',
        dataKey: 'relationshipName',
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
        this.dataSource = modeltList.map(affiliate => ({...affiliate, relationshipName: affiliate.relationship.name, affiliator: affiliate.user.lastName + ' ' + affiliate.user.firstName, age: getAge(affiliate.birthDate)}))
        this.logger.log(`${this.modelName} cargados.`);
      },
      error: () => this.dialogService.open(this.errorGetModelList),
    });
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(AffiliateFormComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        const affiliateUpdated = result?.data;
        this.dataSource = [{...affiliateUpdated, relationshipName: affiliateUpdated.relationship.name, affiliator: affiliateUpdated.user.lastName + ' ' + affiliateUpdated.user.firstName, age: getAge(affiliateUpdated.birthDate)}, ...this.dataSource];
      }
    });
  }

  override updateElement(elem: Affiliate): void {
    const dialogRef = this.dialog.open(AffiliateFormComponent,
      {
        data: elem
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result);
      }
    });
  }

  override showMoreInfo(elem: Affiliate): void {
    this.dialog.open(AffiliateMoreInfoComponent, { data: elem });
  }

}
