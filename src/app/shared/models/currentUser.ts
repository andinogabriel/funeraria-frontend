export interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: {name: string; id: number}[];
  enabled?: boolean;
  startDate?: number;
}