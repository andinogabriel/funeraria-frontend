import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Gender } from '../models/gender';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root'
})
export class GenderService extends CommonServiceService<Gender, Gender> {

  override baseUrl = BASE_ENDPOINT + "/genders";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  } 
}
