import { City } from './city';
export interface Addres {
  id?: number;
  streetName: string;
  blockStreet: number;
  apartment: string;
  flat: string;
  city: City;
}