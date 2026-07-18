export type UserRole = 'customer' | 'admin' | 'manager';

export interface Profile {
  id: string; // UUID matches auth.users
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  profile_id: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default_billing: boolean;
  is_default_shipping: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: Record<string, any>;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}