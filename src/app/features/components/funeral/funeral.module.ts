import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuneralRoutingModule } from './funeral-routing.module';
import { ListFuneralComponent } from './list-funeral/list-funeral.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FuneralFormComponent } from './funeral-form/funeral-form.component';
import { FuneralMoreInfoComponent } from './funeral-more-info/funeral-more-info.component';
import { DeceasedModule } from '../deceased/deceased.module';
import { SearchAffiliateComponent } from './search-affiliate/search-affiliate.component';
import { AffiliatesSearchTableComponent } from './search-affiliate/affiliates-search-table/affiliates-search-table.component';


@NgModule({
  declarations: [
    ListFuneralComponent,
    FuneralFormComponent,
    FuneralMoreInfoComponent,
    SearchAffiliateComponent,
    AffiliatesSearchTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FuneralRoutingModule,
    DeceasedModule
  ]
})
export class FuneralModule { }
