import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansRoutingModule } from './plans-routing.module';
import { ListPlansComponent } from './list-plans/list-plans.component';
import { PlanFormComponent } from './plan-form/plan-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemsPlanComponent } from './items-plan/items-plan.component';
import { PlanMoreInfoComponent } from './plan-more-info/plan-more-info.component';


@NgModule({
  declarations: [
    ListPlansComponent,
    PlanFormComponent,
    ItemsPlanComponent,
    PlanMoreInfoComponent
  ],
  imports: [
    CommonModule,
    PlansRoutingModule,
    SharedModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PlansModule { }
