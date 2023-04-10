import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Deceased } from 'src/app/shared/models/deceased';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class DeceasedService extends CommonServiceService<Deceased, Deceased> {

  override baseUrl = BASE_ENDPOINT + "/deceased";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
