import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Supplier } from 'src/app/shared/models/supplier';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends CommonServiceService<Supplier, Supplier> {

  override baseUrl = BASE_ENDPOINT + "/suppliers";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
