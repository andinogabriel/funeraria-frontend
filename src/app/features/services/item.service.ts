import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheBucket, HttpCacheManager, withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Item } from 'src/app/shared/models/item';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends CommonServiceService<Item, Item> {

  override bucket = new CacheBucket();
  override baseUrl = BASE_ENDPOINT + "/items";

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }

  getItemsByCategoryId(categoryId: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/category/${categoryId}`, {
      context: withCache({
        bucket: this.bucket
      })
    });
  }
}
