import { Gender } from 'src/app/shared/models/gender';
import { Relationship } from 'src/app/shared/models/relationship';
import { User } from 'src/app/shared/models/user';

export interface Affiliate {
  id?: number;
  lastName: string;
  firstName: string;
  dni: number;
  birthDate: string;
  startDate: string;
  gender: Gender;
  user: User;
  relationship: Relationship
}
