import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Item } from 'src/app/shared/models/item';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends CommonServiceService<Item, Item> {

  override baseUrl = BASE_ENDPOINT + "/items";

  constructor(http: HttpClient) {
    super(http);
  }
}
