import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

import { NGXLogger } from 'ngx-logger';
import { UserService } from 'src/app/features/services/user.service';
import { SignupUser } from 'src/app/shared/models/signupUser';
import { User } from 'src/app/shared/models/user';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonListComponent } from '../../common.list.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { UsersFormComponent } from '../users-form/users-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent extends CommonListComponent<
SignupUser,
User,
UserService
>{

  constructor(service: UserService, dialogService: ConfirmDialogService, snackbarService: SnackbarService, dialog: MatDialog, titleService: Title, logger: NGXLogger,) {
    super(service, dialogService, snackbarService, dialog, titleService, logger);
    this.entityId = 'email';
    this.modelName = 'Usuarios';
    this.deleteSuccessMessage = 'Usuario eliminado satisfactoriamente.';
    this.deleteErrorMessage = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de eliminar el usuario seleccionado.',
      title: 'Error al eliminar el usuario.',
    };
    this.errorGetModelList = {
      confirmText: 'Aceptar',
      message: 'Error al tratar de obtener todos los usuarios.',
      title: 'Error al obtener los usuarios.',
    };
    this.deleteMessageOptions = {
      confirmText: 'Aceptar',
      message: '¿Estas seguro de eliminar el usuario seleccionado?',
      title: 'Eliminar usuario.',
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
        name: 'Email',
        dataKey: 'email',
        isSortable: false,
      },
      {
        name: 'Fecha de ingreso',
        dataKey: 'startDate',
        isSortable: true,
      }
    ];
  }

  override updateElement(elem: User): void {
    const dialogRef = this.dialog.open(UsersFormComponent,
      {
        data: elem
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource = this.dataSource.map(user => (user.email === elem.email) ? result.data : user);
      }
    });
  }

  showMoreInfoUser(elem: User): void {
    console.log(elem);
    this.dialog.open(UserInfoComponent, { data: elem });
  }
}
