import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeceasedRoutingModule } from './deceased-routing.module';
import { DeceasedFormComponent } from './deceased-form/deceased-form.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DeceasedFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DeceasedRoutingModule
  ],
  exports: [
    DeceasedFormComponent
  ]
})
export class DeceasedModule { }
