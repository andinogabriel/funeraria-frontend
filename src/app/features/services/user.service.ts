import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { SignupUser } from 'src/app/shared/models/signupUser';
import { User } from 'src/app/shared/models/user';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CommonServiceService<SignupUser, User> {

  override baseUrl = `${BASE_ENDPOINT}/users`;

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
