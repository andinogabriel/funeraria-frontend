import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { Roles } from '../models/roles';
import { CommonServiceService } from './common-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CommonServiceService<Roles, Roles> {

  override baseUrl = environment.baseUrl + "/roles";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
