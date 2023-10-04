import { Component, Inject } from '@angular/core';
import { CommonFormComponent } from '../../common-form.component';
import { CategoryService } from 'src/app/features/services/category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  CategoryFormInputs = [
    {
      name: 'name', label: 'Nombre', type: 'text',
      lgWidth: '0 1 calc(100% - 15px)', smWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre de la categoría es requerido'}
      ]
    },
    {
      name: 'description', label: 'Descripción', type: 'text',
      lgWidth: '0 1 calc(100% - 15px)', smWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre de la categoría es requerido'}
      ]
    },
  ]

  constructor(
    categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public override data: Category,
    dialogRef: MatDialogRef<CategoryFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: FormBuilder
  ) {
    super(
      categoryService,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.createdSuccessMessage = 'Categoría creada satisfactoriamente.';
    this.entityForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} la categoria.`,
      title: `Error al ${data ? 'editar' : 'crear'} categoria`
    }
    this.data ? this.initUpdateCategory() : this.initCreateCategory();
  }

  private initUpdateCategory(): void {
    this.entityId = this.data?.id;
    this.entityInitUpdateFormControl = {
      name: this.data?.name ?? null,
      description: this.data?.description ?? null
    };
  }

  private initCreateCategory(): void {
    this.entityInitFormControl = {
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    };
  }

}
