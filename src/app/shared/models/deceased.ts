import { Address } from "cluster";
import { Gender } from "./gender";
import { Relationship } from "./relationship";
import { User } from "./user";
import { DeathCause } from './deathCause';

export interface Deceased {
  id?: number;
  lastName: string;
  firstName?: string;
  dni: number;
  birthDate: number;
  deathDate: number;
  placeOfDeath: Address;
  registerDate: number;
  deceasedRelationship: Relationship;
  deceasedUser: User;
  deceasedGender: Gender;
  deceasedDeathCause: DeathCause;
}