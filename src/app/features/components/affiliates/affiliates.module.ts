import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffiliatesRoutingModule } from './affiliates-routing.module';
import { ListAffiliatesComponent } from './list-affiliates/list-affiliates.component';
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component';


@NgModule({
  declarations: [
    ListAffiliatesComponent,
    AffiliateFormComponent
  ],
  imports: [
    CommonModule,
    AffiliatesRoutingModule
  ]
})
export class AffiliatesModule { }
