import { ItemsPlan } from "./itemsPlan";

export interface PlanRequest {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  profitPercentage: number;
  itemsPlan: ItemsPlan[];
}

export interface Plan {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number | string;
  profitPercentage: number;
  itemsPlan: ItemsPlan[];
}
