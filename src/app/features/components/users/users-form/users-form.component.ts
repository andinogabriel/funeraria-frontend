import { Component, OnInit, Inject } from "@angular/core";
import { RoleService } from "src/app/shared/services/role.service";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import { first } from "rxjs";
import { Roles } from "src/app/shared/models/roles";
import { User } from "src/app/shared/models/user";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ConfirmDialog } from "src/app/shared/models/confirmDialog";
import { UserService } from "src/app/features/services/user.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-users-form",
  templateUrl: "./users-form.component.html",
  styleUrls: ["./users-form.component.css"],
})
export class UsersFormComponent implements OnInit {
  roles: Roles[] = [];
  selectedRol: Roles;
  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: User,
    private roleService: RoleService,
    private dialogService: ConfirmDialogService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialogRef: MatDialogRef<UsersFormComponent>
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.user = this.data;
      this.findAllRoles();
    });
  }

  assingRole(): void {
    this.dialogService.open(this.confirmChangeRoleMsg);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService
          .assingnUserRole(this?.user?.email, this.selectedRol)
          .subscribe({
            next: (rolesUpdated) => {
              this.router.navigate([this.router.url]);
              this.snackbarService.success(
                `Rol asignado satisfactoriamente al usuario: ${this.user?.lastName} ${this.user?.firstName}`
              );
              this.dialogRef.close({
                data: { ...this?.user, roles: rolesUpdated },
              });
            },
            error: () => this.dialogService.open(this.assignRoleErrMsg),
          });
      }
    });
  }

  private findAllRoles() {
    this.roleService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (roles) => (this.roles = roles),
        error: () => this.dialogService.open(this.getRolesErrMsg),
      });
  }

  private readonly getRolesErrMsg: ConfirmDialog = {
    confirmText: "Aceptar",
    message: "Error al obtener los roles",
    title: "Error al obtener los roels",
  };

  private readonly assignRoleErrMsg: ConfirmDialog = {
    confirmText: "Aceptar",
    message: "Error al asignar el rol especificado",
    title: "Error al asignar rol",
  };

  private readonly confirmChangeRoleMsg: ConfirmDialog = {
    confirmText: "Aceptar",
    message: `¿Está seguro que desea actualizar el rol de este usuario?`,
    title: "Asignar Rol",
  };
}
