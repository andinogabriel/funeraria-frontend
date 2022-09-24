import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager, withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { City } from '../models/city';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root'
})
export class CityService extends CommonServiceService<City, City> {

  override baseUrl = BASE_ENDPOINT + "/cities";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }

  findAllByProvince(provinceId: number): Observable<City[]> {
    const params = new HttpParams().set('province_id', provinceId);
    return this.http.get<City[]>(this.baseUrl, {params, context: withCache()});
  }
}
