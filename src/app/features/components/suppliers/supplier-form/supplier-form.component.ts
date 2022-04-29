import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplierService } from 'src/app/features/services/supplier.service';
import { Supplier } from 'src/app/shared/models/supplier';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent extends CommonFormComponent<
Supplier,
Supplier,
SupplierService
> {

  constructor(
    service: SupplierService,
    @Inject(MAT_DIALOG_DATA) public override data: Supplier,
    dialogRef: MatDialogRef<SupplierFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: FormBuilder
  ) {
    super(
      service,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.createdSuccessMessage = `Proveedor ${data ? 'editado' : 'creado'} satisfactoriamente.`;
    this.entityForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      webPage: new FormControl(''),
      email: new FormControl('')
    });
    if(this.data) {
      this.entityId = this.data?.id;
      this.entityInitUpdateFormControl = {
        'name': this.data?.name ?? null,
        'description': this.data?.nif ?? null,
        'webPage': this.data?.webPage ?? null,
        'email': this.data?.email ?? null,
      };
    } else {
      this.entityInitFormControl = {
        'name': new FormControl('', [Validators.required]),
        'nif': new FormControl('', [Validators.required]),
        'webPage': new FormControl(''),
        'email': new FormControl(''),
      };
    }
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el proveedor.`,
      title: `Error al ${data ? 'editar' : 'crear'} el proveedor.`
    }
  }

}
