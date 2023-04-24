import { Injectable } from '@angular/core';
import { CommonServiceService } from './common-service.service';
import { DeathCause } from '../models/deathCause';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { HttpClient } from '@angular/common/http';
import { HttpCacheManager } from '@ngneat/cashew';

@Injectable({
  providedIn: 'root'
})
export class DeathCauseService extends CommonServiceService<DeathCause, DeathCause> {

  override baseUrl = BASE_ENDPOINT + "/death-causes";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
