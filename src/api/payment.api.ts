import axios from 'axios';
import axiosClient from './axiosClient';
import type { Payment, PaymentPayload } from '../types/payment.types';

interface PaginatedPayments {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

export const getPayments = async (agencyId?: number, status?: string): Promise<PaginatedPayments> => {
  const params: any = {};
  if (agencyId) params.agency_id = agencyId;
  if (status) params.status = status;
  
  const response = await axiosClient.get<PaginatedPayments>('/finance/payments/', { params });
  return response.data;
};

export const createPayment = async (payload: PaymentPayload): Promise<Payment> => {
  try {
    const response = await axiosClient.post<Payment>('/finance/payments/', payload);
    return response.data;
  } catch (error) {
    // Nếu là lỗi từ axios, in ra chi tiết lỗi từ server
    if (axios.isAxiosError(error)) {
      console.error('Lỗi khi tạo phiếu thu:', error.response?.data);
    }
    // Ném lỗi ra để component có thể xử lý
    throw error;
  }
};

export const updatePaymentStatus = async (paymentId: number, status: string, statusReason?: string): Promise<Payment> => {
  try {
    const payload: any = { status };
    if (statusReason) payload.status_reason = statusReason;
    
    const response = await axiosClient.patch<Payment>(`/finance/payments/${paymentId}/status/`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Lỗi khi cập nhật trạng thái phiếu thu:', error.response?.data);
    }
    throw error;
  }
}; 