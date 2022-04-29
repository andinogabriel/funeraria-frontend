import { City } from './city';

export interface Address {
  id?: number;
  streetName: string;
  blockStreet: number;
  apartment: string;
  flat: string;
  city: City;
}