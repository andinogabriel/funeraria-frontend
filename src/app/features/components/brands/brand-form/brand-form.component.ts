import { Component, Inject } from "@angular/core";
import { CommonFormComponent } from "../../common-form.component";
import { Brand } from "src/app/shared/models/brand";
import { BrandService } from "src/app/features/services/brand.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-brand-form",
  templateUrl: "./brand-form.component.html",
  styleUrls: ["./brand-form.component.css"],
})
export class BrandFormComponent extends CommonFormComponent<
  Brand,
  Brand,
  BrandService
> {
  brandFormInputs = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      lgWidth: "0 1 calc(100% - 15px)",
      smWidth: "100%",
      errors: [
        { name: "required", message: "El nombre de la marca es requerido" },
      ],
    },
    {
      name: "webPage",
      label: "Pag. web",
      type: "text",
      lgWidth: "0 1 calc(100% - 20px)",
      smWidth: "100%",
      errors: [],
    },
  ];

  constructor(
    categoryService: BrandService,
    @Inject(MAT_DIALOG_DATA) public override data: Brand,
    dialogRef: MatDialogRef<BrandFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: FormBuilder
  ) {
    super(categoryService, data, dialogRef, snackbarService, dialogService, fb);
    this.createdSuccessMessage = "Categoría creada satisfactoriamente.";
    this.entityForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      webPage: new FormControl(null, []),
    });
    this.createdOrUpdateErrorMessage = {
      confirmText: "Aceptar",
      message: `Ha sucedido un error al intentar ${
        data ? "editar" : "crear"
      } la marca.`,
      title: `Error al ${data ? "editar" : "crear"} marca`,
    };
    this.data ? this.initUpdateBrand() : this.initCreateBrand();
  }

  private initUpdateBrand(): void {
    this.entityId = this.data?.id;
    this.entityInitUpdateFormControl = {
      name: this.data?.name ?? null,
      webPage: this.data?.webPage ?? null
    };
  }

  private initCreateBrand(): void {
    this.entityInitFormControl = {
      name: new FormControl(null, [Validators.required]),
      webPage: new FormControl(null, [])
    };
  }
}
