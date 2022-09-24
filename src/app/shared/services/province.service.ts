import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Province } from '../models/province';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService extends CommonServiceService<Province, Province>{

  override baseUrl = BASE_ENDPOINT + "/provinces";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }

}
