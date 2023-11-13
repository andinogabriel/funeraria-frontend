import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager, withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';
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

  getFuneralsByUser(): Observable<Funeral[]> {
    return this.http.get<Funeral[]>(`${this.baseUrl}/by-user`, {
      context: withCache({
        bucket: this.bucket
      })
    });
  }
}
