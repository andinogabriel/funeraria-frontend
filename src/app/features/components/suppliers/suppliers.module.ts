import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { ListSuppliersComponent } from './list-suppliers/list-suppliers.component';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListSuppliersComponent,
    SupplierFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SuppliersRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SuppliersModule { }
