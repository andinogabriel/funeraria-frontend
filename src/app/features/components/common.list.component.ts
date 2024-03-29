import { Directive, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NGXLogger } from "ngx-logger";
import { interval } from "rxjs";
import { first } from "rxjs/operators";
import { ConfirmDialog } from "src/app/shared/models/confirmDialog";
import { ReusableTableColumn } from "src/app/shared/models/reusableTableColumn";
import { CommonServiceService } from "src/app/shared/services/common-service.service";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@UntilDestroy()
@Directive({ selector: "[CommonListComponent]" })
export abstract class CommonListComponent<
  E,
  M,
  S extends CommonServiceService<E, M>
> implements OnInit
{
  protected entityId: any;
  dataSource: M[] = [];
  modelName!: string;
  dataFetched: boolean;
  deleteSuccessMessage!: string;
  deleteErrorMessage!: ConfirmDialog;
  errorGetModelList: ConfirmDialog;
  deleteMessageOptions: ConfirmDialog;
  displayedColumns: ReusableTableColumn[];

  constructor(
    @Inject(CommonServiceService) protected service: S,
    protected dialogService: ConfirmDialogService,
    protected snackBarService: SnackbarService,
    protected dialog: MatDialog,
    private titleService: Title,
    protected logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.getModelList();
    this.titleService.setTitle(`Funeraria Nuñez y Hnos - ${this.modelName}`);
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  getModelList(): void {
    this.service
      .findAll()
      .pipe(first())
      .subscribe({
        next: (modeltList) => {
          this.dataSource = modeltList;
          this.logger.log(`${this.modelName} cargados.`);
          this.dataFetched = true;
        },
        error: () => {
          this.dialogService.open(this.errorGetModelList);
        },
      });
  }

  removeRow(rowElement: M) {
    this.dialogService.open(this.deleteMessageOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.service
          .deleteById(rowElement[this.entityId])
          .pipe(first())
          .subscribe({
            next: () => {
              this.dataSource = this.dataSource.filter(
                (item) => item !== rowElement
              );
              this.snackBarService.success(this.deleteSuccessMessage);
            },
            error: (err) => {
              this.dialogService.open(
                err
                  ? { ...this.deleteErrorMessage, message: err?.error?.message }
                  : this.deleteErrorMessage
              );
            },
          });
      }
    });
  }

  protected createElement(): void {}

  protected updateElement(elem: M): void {}

  protected showMoreInfo(elem: E): void {}
}
