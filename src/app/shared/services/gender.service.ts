import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { Gender } from '../models/gender';
import { CommonServiceService } from './common-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenderService extends CommonServiceService<Gender, Gender> {

  override baseUrl = environment.baseUrl + "/genders";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  } 
}
