import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Plan } from 'src/app/shared/models/plan';

@Component({
  selector: 'app-plan-more-info',
  templateUrl: './plan-more-info.component.html',
  styleUrls: ['./plan-more-info.component.css']
})
export class PlanMoreInfoComponent implements OnInit {

  panelOpenState = false;
  planInfos: {label: string, value: string | number}[] = [];
  

  constructor(@Inject(MAT_DIALOG_DATA) private data: Plan,) { }
  plan: Plan;

  ngOnInit(): void {
    this.plan = this.data;
    console.log(this.plan);
    this.initPlanInfos();
  }

  private initPlanInfos() {
    this.planInfos = [
      {label: 'Nombre', value: this.plan.name},
      {label: 'Descripción', value: this.plan.description},
      {label: 'Precio', value: this.plan.price}
    ]
  }
  

}
