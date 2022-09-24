import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheBucket, HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Income, IncomeToShow } from 'src/app/shared/models/income';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';


@Injectable({
  providedIn: 'root'
})
export class IncomeService extends CommonServiceService<Income, IncomeToShow> {

  override bucket = new CacheBucket();
  override baseUrl = BASE_ENDPOINT + "/incomes";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
