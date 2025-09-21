export type User = {
    id?: string;
  name?: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  address?: string;
};

export interface UserData {
  id?:string
  name: string;
  email: string;
  phone: string;
  age: string;
  address: string;
}
