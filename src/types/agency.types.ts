export interface Agency {
  id: number;
  code: string;
  name: string;
  type: string;
  type_id: number;
  district: string;
  district_id: number;
  address: string;
  phone: string;
  email: string;
  owner?: string; // Giả sử có thể có hoặc không
  taxCode?: string; // Giả sử có thể có hoặc không
  current_debt: string;
  debt_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
} 