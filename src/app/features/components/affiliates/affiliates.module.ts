import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffiliatesRoutingModule } from './affiliates-routing.module';
import { ListAffiliatesComponent } from './list-affiliates/list-affiliates.component';
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AffiliateMoreInfoComponent } from './affiliate-more-info/affiliate-more-info.component';


@NgModule({
  declarations: [
    ListAffiliatesComponent,
    AffiliateFormComponent,
    AffiliateMoreInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AffiliatesRoutingModule
  ]
})
export class AffiliatesModule { }
