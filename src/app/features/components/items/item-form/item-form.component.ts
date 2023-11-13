import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { CategoryService } from 'src/app/features/services/category.service';
import { ItemService } from 'src/app/features/services/item.service';
import { Brand } from 'src/app/shared/models/brand';
import { Category } from 'src/app/shared/models/category';
import { Item, getItemFormControl } from 'src/app/shared/models/item';
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
  coffinValues = ['ataúd', 'ataud', 'ataúdes', 'ataudes'];
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file

  formInputText = [
    {
      name: 'name', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre es requerido'},
      ]
    },
    {
      name: 'description', label: 'Descripción', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: []
    },
  ]

  ataudObjects = [
    {
      name: 'itemHeight', label: 'Alto', type: 'number',
      smWidth: '100%', lgWidth: '0 1 calc(33% - 15px)',
      errors: [
        {name: 'required', message: 'El alto es requerido'},
        {name: 'min', message: 'Ingrese una altura minima valida'},
        {name: 'max', message: 'Ingrese una altura maxima valida'},
      ]
    },
    {
      name: 'itemLength', label: 'Largo', type: 'number',
      smWidth: '100%', lgWidth: '0 1 calc(33% - 15px)',
      errors: [
        {name: 'required', message: 'El largo es requerido'},
        {name: 'min', message: 'Ingrese un largo minimo valido'},
        {name: 'max', message: 'Ingrese un largo maximo valido'},
      ]
    },
    {
      name: 'itemWidth', label: 'Ancho', type: 'number',
      smWidth: '100%', lgWidth: '0 1 calc(33% - 15px)',
      errors: [
        {name: 'required', message: 'El ancho es requerido'},
        {name: 'min', message: 'Ingrese un ancho minimo valido'},
        {name: 'max', message: 'Ingrese un ancho maximo valido'},
      ]
    }
  ];

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
    this.entityForm = new FormGroup(getItemFormControl());
    if (this.data) {
      this.initUpdatePlanForm();
    } else {
      this.entityInitFormControl = getItemFormControl();
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

   onSelectEvent(categoryChanged: Category) {
    this.categorySelected = categoryChanged;
  }

  onChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      console.log(formData);
    }
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

  private initUpdatePlanForm(): void {
    console.log(this.data);
    this.entityId = this.data?.code;
    this.categorySelected = this.data?.category ?? null;
    this.entityInitUpdateFormControl = {
      name: this.data?.name ?? null,
      description: this.data?.description ?? null,
      brand: this.data?.brand ?? null,
      code: this.data?.code ?? null,
      price: this.data?.price ?? null,
      itemLength: this.data?.itemLength ?? null,
      itemHeight: this.data?.itemHeight ?? null,
      itemWidth: this.data?.itemWidth ?? null,
      category: this.data?.category ?? null
    };
  }

   private setAtaudDynamicValidators(): void {
    const ataudProps = [
      {name: 'itemLength', min: 40, max: 250}, 
      {name: 'itemWidth', min: 20, max: 100}, 
      {name: 'itemHeight', min: 30, max: 80}, 
    ];
    this.entityForm.get('category')?.valueChanges.subscribe((value) => {
      ataudProps.forEach(i => {
        dynamicValidator(this.entityForm, i.name, value['name'], this.coffinValues, true, i.min, i.max);
      });
    });
  }

  

}
