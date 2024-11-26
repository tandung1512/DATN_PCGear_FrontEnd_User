// src/app/account/account.model.ts
export interface Address {
  id: number;
  detail: string;
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
}

export interface Account {
  id: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  addresses: Address[];
  image: string;
  admin: boolean;
  status: boolean;
  confirm: boolean;
  otp?: string | null;
}
