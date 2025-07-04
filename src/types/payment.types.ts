export interface Payment {
  payment_id: number;
  payment_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  amount_collected: string;
  status: string;
  status_reason: string | null;
  created_at: string | null;
}

export interface PaymentPayload {
  agency_id: number;         // agency ID as expected by backend
  amount_collected: number;
  payment_date: string;
  user_id?: number;
} 