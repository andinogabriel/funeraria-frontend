import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs/internal/observable/interval';
import { first } from 'rxjs/operators';
import { CategoryService } from 'src/app/features/services/category.service';
import { ItemService } from 'src/app/features/services/item.service';
import { PlanService } from 'src/app/features/services/plan.service';
import { Category } from 'src/app/shared/models/category';
import { Item } from 'src/app/shared/models/item';
import { ItemsPlan } from 'src/app/shared/models/itemsPlan';
import { Plan } from 'src/app/shared/models/plan';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { onlyNumberWithoutDecimal, onlyTwoDecimalRgx } from 'src/app/shared/utils/regex';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent extends CommonFormComponent<
Plan,
Plan,
PlanService
> {

  categories: Category[] = [];
  items: Item[] = [];
  itemsForm: Item[] = [];

  planFormInputs = [
    {
      name: 'name', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre es requerido.'}
      ]
    },
    {
      name: 'price', label: 'Precio', type: 'number',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El precio es requerido.'},
        {name: 'min', message: 'El precio debe ser positivo.'},
        {name: 'pattern', message: 'El precio debe contener solo dos decimales.'},
      ]
    },
    {
      name: 'description', label: 'Descripción', type: 'text',
      smWidth: '0 1 calc(100% - 15px)', lgWidth: '100%',
      errors: []
    },
  ];

  constructor(
    planService: PlanService,
    @Inject(MAT_DIALOG_DATA) public override data: Plan,
    dialogRef: MatDialogRef<PlanFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: FormBuilder,
    private itemService: ItemService,
    private categoryService: CategoryService,
  ) {
    super(
      planService,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.createdSuccessMessage = `Plan ${data ? 'editado' : 'creado'} satisfactoriamente.`;
    this.entityForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      itemsPlan:  new FormArray([])
    });
    
    this.data ? this.initUpdatePlanForm() : this.initCreatePlanForm();
  
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el plan.`,
      title: `Error al ${data ? 'editar' : 'crear'} el plan`
    }
  }

  override ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    setTimeout(() => {
      this.getItems();
      this.getCategories();
    });
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getItems();
      this.getCategories();
    }, 0);
  }

  get itemsPlan() {
    return (<FormArray>this.entityForm.get('itemsPlan'));
  }

  addItemsPlan() {
    this.itemsForm = this.itemsPlan?.value.map((value: ItemsPlan) => value['item']);
    this.itemsPlan.push(this.getNewItemPlan());
  }

  deleteItemsPlan(itemsPlanlIndex: number) {
    this.itemsPlan.removeAt(itemsPlanlIndex);
  }


  private getItems(): void {
    this.itemService.findAll()
      .pipe(first())
      .subscribe({
        next: (items) => this.items = items,
        error: (error) => console.log(error?.error)
      })
  }

  private getCategories(): void {
    this.categoryService.findAll()
      .pipe(first())
      .subscribe({
        next: (categories) => this.categories = categories,
        error: (error) => console.log(error?.error)
      });
  }

  private getNewItemPlan() {
    return this.fb.group({
      quantity: [null, [Validators.required, Validators.pattern(onlyNumberWithoutDecimal)]],
      item: [null, Validators.required],
      category: [null, Validators.required],
    });
  }

  private initUpdatePlanForm(): void {
    this.entityId = this.data?.id;
      this.entityInitUpdateFormControl = {
        name: this.data?.name ?? null,
        description: this.data?.description ?? null,
        itemsPlan: this.data?.itemsPlan ?? null,
        price: this.data?.price ?? null,
      };
  }

  private initCreatePlanForm(): void {
    this.entityInitFormControl = {
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern(onlyTwoDecimalRgx)]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      itemsPlan:  new FormArray([this.getNewItemPlan()]),
    };
  }

}
