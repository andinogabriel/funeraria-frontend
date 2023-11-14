import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { Province } from '../models/province';
import { CommonServiceService } from './common-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService extends CommonServiceService<Province, Province>{

  override baseUrl = environment.baseUrl + "/provinces";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }

}
