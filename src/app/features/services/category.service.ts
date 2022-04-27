import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Category } from 'src/app/shared/models/category';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CommonServiceService<Category, Category>{

  override baseUrl = BASE_ENDPOINT + "/categories";

  constructor(http: HttpClient) {
    super(http);
  }
}
