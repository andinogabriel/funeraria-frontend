import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomesRoutingModule } from './incomes-routing.module';
import { ListIncomesComponent } from './list-incomes/list-incomes.component';
import { IncomeFormComponent } from './income-form/income-form.component';


@NgModule({
  declarations: [
    ListIncomesComponent,
    IncomeFormComponent
  ],
  imports: [
    CommonModule,
    IncomesRoutingModule
  ]
})
export class IncomesModule { }
