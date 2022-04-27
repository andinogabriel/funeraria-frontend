import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { CategoryService } from 'src/app/features/services/category.service';
import { ItemService } from 'src/app/features/services/item.service';
import { Brand } from 'src/app/shared/models/brand';
import { Category } from 'src/app/shared/models/category';
import { Item } from 'src/app/shared/models/item';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { dynamicValidator } from 'src/app/shared/utils/dynamicValidator';
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

  constructor(
    itemService: ItemService,
    @Inject(MAT_DIALOG_DATA) public override data: Item,
    dialogRef: MatDialogRef<ItemFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: FormBuilder,
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
    this.entityForm = new FormGroup({
      'name': new FormControl(''),
      'description': new FormControl(''),
      'brand': new FormControl(''),
      'code': new FormControl(''),
      'price': new FormControl(''),
      'itemLength': new FormControl(''),
      'itemHeight': new FormControl(''),
      'itemWidth': new FormControl(''),
      'category': new FormControl('')
    });
    if (this.data) {
      this.entityId = this.data?.id;
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
        'name': new FormControl('', [Validators.required]),
        'brand': new FormControl('', [Validators.required]),
        'category': new FormControl('', [Validators.required]),
        'description': new FormControl(''),
        'itemLength': new FormControl('',),
        'itemWidth': new FormControl(''),
        'itemHeight': new FormControl(''),
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
    this.breakPoints();
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
    const ataudProps = ['itemLength', 'itemWidth', 'itemHeight'];
    this.entityForm.get('category')?.valueChanges.subscribe((value) => {
      ataudProps.forEach(i => {
        dynamicValidator(this.entityForm, i, value['name'], 'ataúd');
      });
    });
  }

   // Cards
   breakPoints() {
    switch(true) {
        case (window.innerWidth <= 480):
          this.columns = 1;
          break;
        case (window.innerWidth > 480 ):
          this.columns = 2;
          break;
        default:
          this.columns = 2;
      }
  }

  onResize(event) {
    this.breakPoints();
  }



}
