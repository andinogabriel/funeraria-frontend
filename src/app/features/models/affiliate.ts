import { Gender } from 'src/app/shared/models/gender';
import { User } from 'src/app/shared/models/user';

export interface Affiliate {
  id?: number;
  lastName: string;
  firstName: string;
  dni: number;
  birthDate: number;
  startDate: number;
  affiliateGender: Gender;
  user: User;
}