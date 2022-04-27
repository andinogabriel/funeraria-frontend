import { Inject } from '@angular/core';
import { Directive, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonServiceService } from '../../shared/services/common-service.service';
import { GenericEntity } from '../../shared/models/genericEntity';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ConfirmDialog } from 'src/app/shared/models/confirmDialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Directive({ selector: '[CommonFormComponent]' })
export abstract class CommonFormComponent<
  E,
  M,
  S extends CommonServiceService<E, M>
> implements OnInit{
  entity!: E;
  entityForm!: FormGroup;
  protected entityId: number;
  protected createdSuccessMessage: string;
  protected createdOrUpdateErrorMessage: ConfirmDialog;
  protected modelName!: string;
  protected entityFormToUpdate: any;
  protected entityInitFormControl: any;
  protected entityInitUpdateFormControl: any;

  constructor(
    @Inject(CommonServiceService) protected service: S,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected dialogRef: MatDialogRef<CommonFormComponent<E, M, S>>,
    protected snackbarService: SnackbarService,
    protected dialogService: ConfirmDialogService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
  }

  public hasError = (controlName: string, errorName: string): boolean => {
    return this.entityForm?.controls[controlName].hasError(errorName);
  };

  onSubmit(): void {
    this.entity = this.entityForm.value;
    if(this.data) {
      this.update(this.entity);
    } else {
      this.create(this.entity);
    }
  }

  create(elemToCreate: E): void {
    this.service.create(elemToCreate).subscribe({
      next: (elemCreated) => {
        this.dialogRef.close({ data: elemCreated });
        this.snackbarService.success(this.createdSuccessMessage);
      },
      error: () => this.dialogService.open(this.createdOrUpdateErrorMessage),
    });
  }

  update(elemToUpdate: E): void {
    this.service.edit(this.entityId, elemToUpdate).subscribe({
      next: (elemUpdated) => {
        this.dialogRef.close({ data: elemUpdated });
        this.snackbarService.success(this.createdSuccessMessage);
      },
      error: (error) => {
        this.dialogService.open(this.createdOrUpdateErrorMessage);
        console.log(error)
      },
    });
  }

  initFormControl(): void {
    this.entityForm = this.fb.group(this.entityInitFormControl);
  }

  initUpdateFormControl(): void {
    this.entityForm.setValue(this.entityInitUpdateFormControl);
  }

  compareFn(elem1: M, elem2: M): boolean {
    if (elem1 === undefined && elem2 === undefined) return true;
    return elem1 === null ||
      elem2 === null ||
      elem1 === undefined ||
      elem2 === undefined
      ? false
      : elem1['id']=== elem2['id'];
  }
}
