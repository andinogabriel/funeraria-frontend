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
import { ITEM_PLAN_FORM_GROUP, ItemsPlan } from 'src/app/shared/models/itemsPlan';
import { PLAN_FORM_CONTROL, Plan, PlanRequest } from 'src/app/shared/models/plan';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { onlyTwoDecimalRgx } from 'src/app/shared/utils/regex';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent extends CommonFormComponent<
PlanRequest,
Plan,
PlanService
> {

  categories: Category[] = [];
  items: Item[] = [];
  itemsForm: Item[] = [];
  percentage: number = null;
  price: number = 0;

  planFormInputs = [
    {
      name: 'name', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre es requerido'}
      ]
    },
    {
      name: 'profitPercentage', label: 'Porcentaje', type: 'number',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El porcentaje es requerido'},
        {name: 'min', message: 'El porcentaje debe ser positivo'},
        {name: 'pattern', message: 'El porcentaje debe contener solo dos decimales'},
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
    this.entityForm = new FormGroup(PLAN_FORM_CONTROL);
    
    this.data ? this.initUpdatePlanForm() : this.initCreatePlanForm();
  
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el plan.`,
      title: `Error al ${data ? 'editar' : 'crear'} el plan`
    }
  }

  override ngOnInit(): void {
    setTimeout(() => {
      this.getItems();
      this.getCategories();
    });
    this.priceCalculator();
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    interval(1000).pipe(untilDestroyed(this)).subscribe();
  }

  override create(elemToCreate: PlanRequest): void {
    this.service.create(elemToCreate).subscribe({
      next: (elemCreated) => {
        this.dialogRef.close({ data: {...elemCreated, 'price': elemCreated?.price ? '$' + elemCreated.price : '0'} });
        this.snackbarService.success(this.createdSuccessMessage);
      },
      error: (err) => {
        this.dialogService.open(err ? {...this.createdOrUpdateErrorMessage, 'message': err?.error?.message} : this.createdOrUpdateErrorMessage)
      },
    });
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

  get profitPercentage() {
    return this.entityForm.get('profitPercentage');
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
    return this.fb.group(ITEM_PLAN_FORM_GROUP);
  }

  private priceCalculator(): void {
    this.entityForm.valueChanges.subscribe((value: PlanRequest) => {
      const pricePorcentage = +value.profitPercentage / 100;
      const subTotal = value.itemsPlan.reduce((a,b) => a + ((+b?.quantity ? b.quantity : 0) * (+b.item?.price ? +b.item.price : 0)), 0);
      this.price = subTotal + subTotal * pricePorcentage;
    });
  }

  private initUpdatePlanForm(): void {
    this.price = parseInt(this.data?.price as string);
    this.entityId = this.data?.id;
    this.getItemsPlanFromUpdate();
    this.entityInitUpdateFormControl = {
      name: this.data?.name ?? null,
      description: this.data?.description ?? null,
      profitPercentage: this.data?.profitPercentage ?? null,
    };
  }

  private initCreatePlanForm(): void {
    this.entityInitFormControl = {
      name: new FormControl<string | null>('', [Validators.required]),
      profitPercentage:  new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.pattern(onlyTwoDecimalRgx)]),
      category: new FormControl<Category | null>(null),
      description: new FormControl<string | null>(''),
      itemsPlan:  new FormArray([this.getNewItemPlan()]),
    };
  }

  private getItemsPlanFromUpdate(): void {
    if(this.data.hasOwnProperty('itemsPlan')) {
      this.itemsPlan.clear();
      Object.values(this.data?.itemsPlan as ItemsPlan[]).forEach(a => {
        const itemPlan = this.fb.group({
          item: a?.item,
          quantity: a?.quantity,
          category: a?.item?.category
        });
        this.itemsPlan.push(itemPlan);
      });
    }
  }

}