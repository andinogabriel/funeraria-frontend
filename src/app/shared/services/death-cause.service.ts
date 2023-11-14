import { Injectable } from '@angular/core';
import { CommonServiceService } from './common-service.service';
import { DeathCause } from '../models/deathCause';
import { HttpClient } from '@angular/common/http';
import { HttpCacheManager } from '@ngneat/cashew';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeathCauseService extends CommonServiceService<DeathCause, DeathCause> {

  override baseUrl = environment.baseUrl + "/death-causes";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
