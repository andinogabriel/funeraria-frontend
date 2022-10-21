import { Component, Inject, OnInit } from '@angular/core';
import { CommonFormComponent } from '../../common-form.component';
import { CategoryService } from 'src/app/features/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent extends CommonFormComponent<
  Category,
  Category,
  CategoryService
> {
  constructor(
    categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public override data: Category,
    dialogRef: MatDialogRef<CategoryFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: UntypedFormBuilder
  ) {
    super(
      categoryService,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.createdSuccessMessage = 'Categoria creada satisfactoriamente.';
    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(''),
      description: new UntypedFormControl('')
    });
    if(this.data) {
      this.entityId = this.data?.id;
      this.entityInitUpdateFormControl = {
        'name': this.data?.name ?? null,
        'description': this.data?.description ?? null
      };
    } else {
      this.entityInitFormControl = {
        'name': new UntypedFormControl('', [Validators.required]),
        'description': new UntypedFormControl('', [Validators.required]),
      };
    }
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} la categoria.`,
      title: `Error al ${data ? 'editar' : 'crear'} categoria`
    }
  }
}
