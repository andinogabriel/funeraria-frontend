export interface SelectInput {
  name: string;
  label: string;
  smWidth: string;
  lgWidth: string;
  items: any[];
  errors: Error[];
  adminShow?: boolean;
}

interface Error {
  name: string;
  message: string;
}