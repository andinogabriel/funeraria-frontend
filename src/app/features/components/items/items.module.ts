import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ListItemsComponent } from './list-items/list-items.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListItemsComponent,
    ItemFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ItemsRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ItemsModule { }
