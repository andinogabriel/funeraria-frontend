import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { ListBrandsComponent } from './list-brands/list-brands.component';
import { BrandFormComponent } from './brand-form/brand-form.component';


@NgModule({
  declarations: [
    ListBrandsComponent,
    BrandFormComponent
  ],
  imports: [
    CommonModule,
    BrandsRoutingModule
  ]
})
export class BrandsModule { }
