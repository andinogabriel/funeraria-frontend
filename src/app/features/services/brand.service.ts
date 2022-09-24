import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Brand } from 'src/app/shared/models/brand';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService extends CommonServiceService<Brand, Brand>{

  override baseUrl =  BASE_ENDPOINT + "/brands";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
