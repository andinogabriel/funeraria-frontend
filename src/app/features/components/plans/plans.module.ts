import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansRoutingModule } from './plans-routing.module';
import { ListPlansComponent } from './list-plans/list-plans.component';
import { PlanFormComponent } from './plan-form/plan-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemsPlanComponent } from './items-plan/items-plan.component';


@NgModule({
  declarations: [
    ListPlansComponent,
    PlanFormComponent,
    ItemsPlanComponent
  ],
  imports: [
    CommonModule,
    PlansRoutingModule,
    SharedModule,
  ]
})
export class PlansModule { }
