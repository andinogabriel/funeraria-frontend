import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { ReceiptType } from '../models/receiptType';
import { CommonServiceService } from './common-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceiptTypeService extends CommonServiceService<ReceiptType, ReceiptType>{

  override baseUrl = environment.baseUrl + "/receiptTypes";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
