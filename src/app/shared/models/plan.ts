import { ItemsPlan } from "./itemsPlan";

export interface Plan {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number | string;
  itemsPlan: ItemsPlan[];
}
