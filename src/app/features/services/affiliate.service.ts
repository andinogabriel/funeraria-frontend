import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { Affiliate } from '../models/affiliate';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService extends CommonServiceService<Affiliate, Affiliate>{

  override baseUrl =  BASE_ENDPOINT + "/affiliates";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  } 

}
