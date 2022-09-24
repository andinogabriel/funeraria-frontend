import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheManager } from '@ngneat/cashew';
import { Category } from 'src/app/shared/models/category';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CommonServiceService<Category, Category>{

  override baseUrl = BASE_ENDPOINT + "/categories";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }
}
