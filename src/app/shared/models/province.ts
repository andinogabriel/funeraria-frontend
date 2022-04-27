import { City } from './city';
export interface Province {
  id: number;
  name: string;
  code31662: string;
  cities: City[]
}