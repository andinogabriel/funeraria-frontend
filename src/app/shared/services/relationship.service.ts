import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Relationship } from 'src/app/shared/models/relationship';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root'
})
export class RelationshipService extends CommonServiceService<Relationship, Relationship> {

  override baseUrl = BASE_ENDPOINT + "/relationships";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
