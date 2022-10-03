import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { first } from 'rxjs/operators';
import { CategoryService } from 'src/app/features/services/category.service';
import { ItemService } from 'src/app/features/services/item.service';
import { Category } from 'src/app/shared/models/category';
import { Item } from 'src/app/shared/models/item';
import { filterAlreadySelectedItems } from 'src/app/shared/utils/commonFunctions';

@Component({
  selector: 'app-items-plan',
  templateUrl: './items-plan.component.html',
  styleUrls: ['./items-plan.component.css']
})
export class ItemsPlanComponent implements OnInit {
  @Input() inputFormGroup = this.fb.group({});
  @Input() itemsFormGroup: Item[] = [];
  categories: Category[] = [];
  items: Item[] = [];
  selectedCategory: Category = null;

  quantityErrors = [
    {type: 'required', message: 'La cantidad es requerida.'},
    {type: 'min', message: 'La cantidad debe ser positiva.'},
    {type: 'pattern', message: 'La cantidad debe ser un numero entero.'},
  ]
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private itemSerivce: ItemService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.getCategories();
      if(this.inputFormGroup.get('category')?.value) {
        this.selectedCategory = this.inputFormGroup.get('category').value;
        this.getItems();
      }
    });
  }

  onCategoryChange(event: MatSelectChange): void {
    this.getItemsByCategoryId(event.value?.id);
  }

  hasError = (controlName: string, errorName: string): boolean => {
    return this.inputFormGroup?.controls[controlName].hasError(errorName);
  };

  compareCategoryFn(elem1: Category, elem2: Category): boolean {
    if (elem1 === undefined && elem2 === undefined) return true;
    return elem1 === null ||
      elem2 === null ||
      elem1 === undefined ||
      elem2 === undefined
      ? false
      : elem1.id === elem2.id;
  }

  compareItemFn(elem1: Item, elem2: Item): boolean {
    if (elem1 === undefined && elem2 === undefined) return true;
    return elem1 === null ||
      elem2 === null ||
      elem1 === undefined ||
      elem2 === undefined
      ? false
      : elem1.code == elem2.code;
  }

  private getCategories(): void {
    this.categoryService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (categories) => (this.categories = categories),
        error: () => console.log("Error al obtener las categorias."),
      });
  }

  private getItems(): void {
    const categoryId = this.selectedCategory?.id;
    this.getItemsByCategoryId(categoryId);
  }

  private getItemsByCategoryId(categoryId: number): void {
    this.itemSerivce
      .getItemsByCategoryId(categoryId)
      .pipe(first())
      .subscribe({
        next: (items) => (this.items = filterAlreadySelectedItems(items, this.itemsFormGroup)),
        error: () =>
          console.log(
            "Error al obtener los articulos de la categoria seleccionada."
          ),
      });
  }

}
