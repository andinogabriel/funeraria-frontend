import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager, withCache } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { Affiliate } from '../models/affiliate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService extends CommonServiceService<Affiliate, Affiliate>{

  override baseUrl =  BASE_ENDPOINT + "/affiliates";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  } 

  getAffiliatesByUser(): Observable<Affiliate[]> {
    return this.http.get<Affiliate[]>(`${this.baseUrl}/by-user`, {
      context: withCache({
        bucket: this.bucket
      })
    });
  }

  findAffiliatesByFirstNameOrLastNameOrDniContaining(value: string): Observable<Affiliate[]> {
    return this.http.get<Affiliate[]>(`${this.baseUrl}/search`, {
      params: new HttpParams().append("value", value),
      context: withCache({
        bucket: this.bucket
      })
    });
  }

}
