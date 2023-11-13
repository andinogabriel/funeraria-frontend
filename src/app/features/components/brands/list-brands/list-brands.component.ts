import { Component } from "@angular/core";
import { BrandService } from "src/app/features/services/brand.service";
import { Brand } from "src/app/shared/models/brand";
import { CommonListComponent } from "../../common.list.component";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { NGXLogger } from "ngx-logger";
import { BrandFormComponent } from "../brand-form/brand-form.component";

@Component({
  selector: "app-list-brands",
  templateUrl: "./list-brands.component.html",
  styleUrls: ["./list-brands.component.css"],
})
export class ListBrandsComponent extends CommonListComponent<
  Brand,
  Brand,
  BrandService
> {
  constructor(
    service: BrandService,
    dialogService: ConfirmDialogService,
    snackbarService: SnackbarService,
    dialog: MatDialog,
    titleService: Title,
    logger: NGXLogger
  ) {
    super(
      service,
      dialogService,
      snackbarService,
      dialog,
      titleService,
      logger
    );
    this.entityId = "id";
    this.modelName = "Marcas";
    this.deleteSuccessMessage = "Marca eliminada satisfactoriamente.";
    this.deleteErrorMessage = {
      confirmText: "Aceptar",
      message: "Error al tratar de eliminar la marca seleccionada.",
      title: "Error al eliminar marca.",
    };
    this.errorGetModelList = {
      confirmText: "Aceptar",
      message: "Error al tratar de obtener todas las marcas.",
      title: "Error al obtener las marcas.",
    };
    this.deleteMessageOptions = {
      confirmText: "Aceptar",
      message: "¿Estas seguro de eliminar la marca seleccionada?",
      title: "Eliminar marca.",
    };
    this.displayedColumns = [
      {
        name: "Nombre",
        dataKey: "name",
        isSortable: true,
      },
      {
        name: "Pag. web",
        dataKey: "webPage",
        isSortable: true,
      },
    ];
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(BrandFormComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource = [result?.data, ...this.dataSource];
      }
    });
  }

  override updateElement(elem: Brand): void {
    const dialogRef = this.dialog.open(BrandFormComponent, {
      data: elem,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource = this.dataSource.map((brand) =>
          brand.id === elem.id ? result.data : brand
        );
      }
    });
  }
}
