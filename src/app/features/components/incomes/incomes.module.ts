import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomesRoutingModule } from './incomes-routing.module';
import { ListIncomesComponent } from './list-incomes/list-incomes.component';
import { IncomeFormComponent } from './income-form/income-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncomeMoreInfoComponent } from './income-more-info/income-more-info.component';
import { IncomeDetailFormComponent } from './income-detail-form/income-detail-form.component';


@NgModule({
  declarations: [
    ListIncomesComponent,
    IncomeFormComponent,
    IncomeMoreInfoComponent,
    IncomeDetailFormComponent,
  ],
  imports: [
    CommonModule,
    IncomesRoutingModule,
    SharedModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IncomesModule { }
