import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Funeral, FuneralRequest } from 'src/app/shared/models/funeral';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class FuneralService extends CommonServiceService<FuneralRequest, Funeral> {

  override baseUrl = BASE_ENDPOINT + "/funerals";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
