import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { ListSuppliersComponent } from './list-suppliers/list-suppliers.component';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';


@NgModule({
  declarations: [
    ListSuppliersComponent,
    SupplierFormComponent
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule
  ]
})
export class SuppliersModule { }
