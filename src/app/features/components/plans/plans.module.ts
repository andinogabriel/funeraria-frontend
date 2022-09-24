import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlansRoutingModule } from './plans-routing.module';
import { ListPlansComponent } from './list-plans/list-plans.component';
import { PlanFormComponent } from './plan-form/plan-form.component';


@NgModule({
  declarations: [
    ListPlansComponent,
    PlanFormComponent
  ],
  imports: [
    CommonModule,
    PlansRoutingModule
  ]
})
export class PlansModule { }
