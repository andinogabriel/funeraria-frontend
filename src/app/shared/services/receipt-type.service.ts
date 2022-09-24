import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { ReceiptType } from '../models/receiptType';
import { CommonServiceService } from './common-service.service';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Injectable({
  providedIn: 'root'
})
export class ReceiptTypeService extends CommonServiceService<ReceiptType, ReceiptType>{

  override baseUrl = BASE_ENDPOINT + "/receiptTypes";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
