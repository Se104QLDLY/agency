import axiosClient from './axiosClient';

// ======================================================================================
// REPORT API
// ======================================================================================

export interface SalesReportParams {
  from?: string;
  to?: string;
  agency_id?: number;
}

export interface DebtReportParams {
  agency_id?: number;
}

// Kiểu dữ liệu cho một mục trong báo cáo doanh số (ví dụ: theo tháng)
export interface SalesReportItem {
  month: string; // ví dụ: "2024-07"
  total_revenue: number;
  total_issues: number;
  new_debt_generated: number;
}

// Kiểu dữ liệu cho báo cáo công nợ (phân loại theo tuổi nợ)
export interface DebtReportData {
  agency_id: number;
  agency_name: string;
  total_debt: number;
  debt_aging_buckets: {
    "0-30": number;
    "31-60": number;
    "61-90": number;
    "90+": number;
  };
}

/**
 * API để lấy báo cáo doanh số
 * @param params - Các tham số filter (from, to, agency_id)
 * @returns - Mảng dữ liệu báo cáo doanh số
 */
export const getSalesReport = async (params: SalesReportParams) => {
  // URL cuối cùng và chính xác nhất, trỏ đến action 'sales' trong DebtViewSet
  const { data } = await axiosClient.get('/finance/debts/sales/', { params });
  return data;
};

/**
 * API để lấy báo cáo công nợ
 * @param params - Tham số filter (agency_id)
 * @returns - Dữ liệu báo cáo công nợ
 */
export const getDebtReport = async (params: DebtReportParams) => {
  // URL cuối cùng và chính xác nhất, trỏ đến action 'aging' trong DebtViewSet
  const { data } = await axiosClient.get('/finance/debts/aging/', { params });
  return data;
}; 