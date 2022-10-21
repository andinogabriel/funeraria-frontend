import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { CategoryService } from 'src/app/features/services/category.service';
import { ItemService } from 'src/app/features/services/item.service';
import { Brand } from 'src/app/shared/models/brand';
import { Category } from 'src/app/shared/models/category';
import { Item } from 'src/app/shared/models/item';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { dynamicValidator } from 'src/app/shared/utils/validators';
import { CommonFormComponent } from '../../common-form.component';
import { BrandService } from './../../../services/brand.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent extends CommonFormComponent<
Item,
Item,
ItemService
> {

  brands: Brand[] = [];
  categories: Category[] = [];
  categorySelected: Category;
  columns: number;

  formInputText = [
    {
      name: 'name', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El Nombre es requerido'},
      ]
    },
    {
      name: 'description', label: 'Descripción', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: []
    },
  ]

  ataudObjects = [
    {matLabel: 'Alto', name: 'itemHeight', errorMessageRequired: 'La altura del ataud es requerida.', errorMessageMin: 'Ingrese una altura minima valida.', errorMessageMax: 'Ingrese una altura maxima valida.'},
    {matLabel: 'Largo', name: 'itemLength', errorMessageRequired: 'La longitud del ataud es requerida.', errorMessageMin: 'Ingrese un largo minimo valido.', errorMessageMax: 'Ingrese un largo maximo valido.'},
    {matLabel: 'Ancho', name: 'itemWidth', errorMessageRequired: 'El ancho del ataud es requerida.', errorMessageMin: 'Ingrese un ancho minimo valido.', errorMessageMax: 'Ingrese un ancho maximo valido.'}
  ]

  constructor(
    itemService: ItemService,
    @Inject(MAT_DIALOG_DATA) public override data: Item,
    dialogRef: MatDialogRef<ItemFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: UntypedFormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
  ) {
    super(
      itemService,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.createdSuccessMessage = `Artículo ${data ? 'editado' : 'creado'} satisfactoriamente.`;
    this.entityForm = new UntypedFormGroup({
      'name': new UntypedFormControl(''),
      'description': new UntypedFormControl(''),
      'brand': new UntypedFormControl(''),
      'code': new UntypedFormControl(''),
      'price': new UntypedFormControl(''),
      'itemLength': new UntypedFormControl(''),
      'itemHeight': new UntypedFormControl(''),
      'itemWidth': new UntypedFormControl(''),
      'category': new UntypedFormControl('')
    });
    if (this.data) {
      this.entityId = this.data?.code;
      this.categorySelected = this.data?.category ?? null;
      this.entityInitUpdateFormControl = {
        'name': this.data?.name ?? null,
        'description': this.data?.description ?? null,
        'brand': this.data?.brand ?? null,
        'code': this.data?.code ?? null,
        'price': this.data?.price ?? null,
        'itemLength': this.data?.itemLength ?? null,
        'itemHeight': this.data?.itemHeight ?? null,
        'itemWidth': this.data?.itemWidth ?? null,
        'category': this.data?.category ?? null
      };
    } else {
      this.entityInitFormControl = {
        'name': new UntypedFormControl('', [Validators.required]),
        'brand': new UntypedFormControl('', [Validators.required]),
        'category': new UntypedFormControl('', [Validators.required]),
        'description': new UntypedFormControl(''),
        'itemLength': new UntypedFormControl(''),
        'itemWidth': new UntypedFormControl(''),
        'itemHeight': new UntypedFormControl(''),
      };
    }
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el artículo.`,
      title: `Error al ${data ? 'editar' : 'crear'} el artículo`
    }
  }

  override ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
    this.setAtaudDynamicValidators();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getBrands();
      this.getCategories();
    }, 0);
   }


  private getBrands(): void {
    this.brandService.findAll()
      .pipe(first())
      .subscribe({
        next: (brands) => this.brands = brands,
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

   private setAtaudDynamicValidators(): void {
    const ataudProps = [
      {name: 'itemLength', min: 40, max: 250}, 
      {name: 'itemWidth', min: 20, max: 100}, 
      {name: 'itemHeight', min: 30, max: 80}, 
    ];
    this.entityForm.get('category')?.valueChanges.subscribe((value) => {
      ataudProps.forEach(i => {
        dynamicValidator(this.entityForm, i.name, value['name'], 'ataúd', true, i.min, i.max);
      });
    });
  }

}
