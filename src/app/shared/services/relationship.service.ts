import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { Relationship } from 'src/app/shared/models/relationship';
import { CommonServiceService } from './common-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelationshipService extends CommonServiceService<Relationship, Relationship> {

  override baseUrl = environment.baseUrl + "/relationships";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
