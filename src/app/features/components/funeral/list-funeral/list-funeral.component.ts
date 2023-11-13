import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { NGXLogger } from "ngx-logger";
import { first, firstValueFrom } from "rxjs";
import { FuneralService } from "src/app/features/services/funeral.service";
import { Funeral, FuneralRequest } from "src/app/shared/models/funeral";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { CommonListComponent } from "../../common.list.component";
import { FuneralFormComponent } from "../funeral-form/funeral-form.component";
import { FuneralMoreInfoComponent } from "../funeral-more-info/funeral-more-info.component";
import { ScrollStrategy, ScrollStrategyOptions } from "@angular/cdk/overlay";
import { TokenService } from "src/app/core/services/token.service";

@Component({
  selector: "app-list-funeral",
  templateUrl: "./list-funeral.component.html",
  styleUrls: ["./list-funeral.component.css"],
})
export class ListFuneralComponent extends CommonListComponent<
  FuneralRequest,
  Funeral,
  FuneralService
> {
  scrollStrategy: ScrollStrategy;

  constructor(
    service: FuneralService,
    dialogService: ConfirmDialogService,
    snackbarService: SnackbarService,
    dialog: MatDialog,
    titleService: Title,
    logger: NGXLogger,
    private readonly sso: ScrollStrategyOptions,
    private tokenService: TokenService
  ) {
    super(
      service,
      dialogService,
      snackbarService,
      dialog,
      titleService,
      logger
    );
    this.scrollStrategy = this.sso.close();
    this.entityId = "id";
    this.modelName = "Funerales";
    this.deleteSuccessMessage = "Funeral eliminado satisfactoriamente.";
    this.deleteErrorMessage = {
      confirmText: "Aceptar",
      message: "Error al tratar de eliminar el funeral seleccionada.",
      title: "Error al eliminar el funeral.",
    };
    this.errorGetModelList = {
      confirmText: "Aceptar",
      message: "Error al tratar de obtener todas los funerales.",
      title: "Error al obtener los funerales.",
    };
    this.deleteMessageOptions = {
      confirmText: "Aceptar",
      message: "¿Estas seguro de eliminar el funeral seleccionada?",
      title: "Eliminar funeral.",
    };
    this.displayedColumns = [
      {
        name: "Fecha de sepelio",
        dataKey: "funeralDate",
        isSortable: true,
      },
      {
        name: "Difunto",
        dataKey: "deceased",
        isSortable: false,
      },
      {
        name: "Plan",
        dataKey: "plan",
        isSortable: true,
      },
      {
        name: "Monto",
        dataKey: "totalAmount",
        isSortable: true,
      },
      {
        name: "Tipo de recibo",
        dataKey: "receiptType",
        isSortable: true,
      },
    ];
  }

  override getModelList(): void {
    this.tokenService.isAdmin() ?
      this.service
        .findAll()
        .pipe(first())
        .subscribe({
          next: (modeltList) => {
            this.dataSource = modeltList.map((funeral) => ({
              ...funeral,
              deceased: this.getDeceasedNames(funeral),
              plan: funeral.plan["name"],
              totalAmount: "$" + funeral.totalAmount,
              receiptType: funeral.receiptType["name"],
            }));
            this.logger.log(`${this.modelName} cargados.`);
            this.dataFetched = true;
          },
          error: () => this.dialogService.open(this.errorGetModelList),
        })
      :
        this.service
        .getFuneralsByUser()
        .pipe(first())
        .subscribe({
          next: (modeltList) => {
            this.dataSource = modeltList.map((funeral) => ({
              ...funeral,
              deceased: this.getDeceasedNames(funeral),
              plan: funeral.plan["name"],
              totalAmount: "$" + funeral.totalAmount,
              receiptType: funeral.receiptType["name"],
            }));
            this.logger.log(`${this.modelName} cargados.`);
            this.dataFetched = true;
          },
          error: () => this.dialogService.open(this.errorGetModelList),
        });
  }

  override createElement(): void {
    const dialogRef = this.dialog.open(FuneralFormComponent, {
      scrollStrategy: this.scrollStrategy,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const funeralCreated: Funeral = result.data;
        this.dataSource = [
          {
            ...funeralCreated,
            deceased: this.getDeceasedNames(funeralCreated),
            plan: funeralCreated.plan["name"],
            totalAmount: "$" + funeralCreated.totalAmount,
            receiptType: funeralCreated.receiptType["name"],
          },
          ...this.dataSource,
        ];
      }
    });
  }

  override async updateElement(elem: Funeral): Promise<void> {
    const funeralToEdit = await firstValueFrom(this.service.getById(elem?.id));
    const dialogRef = this.dialog.open(FuneralFormComponent, {
      data: funeralToEdit,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  override showMoreInfo(elem: FuneralRequest): void {
    this.dialog.open(FuneralMoreInfoComponent, { data: elem });
  }

  private getDeceasedNames = (funeral: Funeral): string =>
    funeral.deceased["lastName"] + " " + funeral.deceased["firstName"];
}
