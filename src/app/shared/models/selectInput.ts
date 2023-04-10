export interface SelectInput {
  name: string;
  label: string;
  smWidth: string;
  lgWidth: string;
  items: any[];
  errors: Error[];
}

interface Error {
  name: string;
  message: string;
}