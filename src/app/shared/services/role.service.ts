import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Roles } from '../models/roles';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CommonServiceService<Roles, Roles> {

  override baseUrl = BASE_ENDPOINT + "/roles";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
