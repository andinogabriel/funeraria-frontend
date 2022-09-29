import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Plan } from 'src/app/shared/models/plan';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService extends CommonServiceService<Plan, Plan>{

  override baseUrl = BASE_ENDPOINT + "/plans";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
