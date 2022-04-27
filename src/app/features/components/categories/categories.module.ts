import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryFormComponent } from './category-form/category-form.component';


@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule
  ],
  declarations: [
    CategoriesListComponent,
    CategoryFormComponent
  ],
  entryComponents: [
    CategoryFormComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CategoriesModule { }
