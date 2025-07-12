import axiosClient from './axiosClient';

// Types matching backend Issue model
export interface DistributionItem {
  item: string; // item_id
  quantity: number;
  unit_price?: number;
}

export interface DistributionRequest {
  issue_id: number;
  issue_date: string;
  agency_id: number;
  agency_name?: string;
  user_id: number;
  user_name?: string;
  total_amount: string;
  status: 'processing' | 'confirmed' | 'postponed' | 'cancelled';
  status_reason?: string;
  created_at?: string;
  details?: {
    issue_detail_id: number;
    item: number;
    item_name: string;
    quantity: number;
    unit_price: string;
    line_total: string;
  }[];
}

export interface CreateDistributionRequest {
  agency_id: number;
  issue_date?: string;
  items: DistributionItem[];
  delivery_address?: string; // For frontend tracking only
}

export interface DistributionListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: DistributionRequest[];
}

export interface Product {
  item_id: number;
  item_name: string;
  unit: number;
  unit_name: string;
  price: string;
  stock_quantity: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Product[];
}

export const distributionApi = {
  // Get all distribution requests (issues)
  getDistributionRequests: async (params?: {
    limit?: number;
    offset?: number;
    agency_id?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<DistributionListResponse> => {
    const response = await axiosClient.get('/inventory/issues/', { params });
    return response.data;
  },

  // Get distribution request by ID
  getDistributionRequest: async (id: number): Promise<DistributionRequest> => {
    const response = await axiosClient.get(`/inventory/issues/${id}/`);
    return response.data;
  },

  // Create new distribution request
  createDistributionRequest: async (data: CreateDistributionRequest): Promise<DistributionRequest> => {
    const response = await axiosClient.post('/inventory/issues/', data);
    return response.data;
  },

  // Update distribution request status
  updateDistributionStatus: async (id: number, data: { 
    status: string; 
    status_reason?: string 
  }): Promise<DistributionRequest> => {
    const response = await axiosClient.patch(`/inventory/issues/${id}/update_status/`, data);
    return response.data;
  },

  // Get products/items for distribution
  getProducts: async (params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<ProductListResponse> => {
    const response = await axiosClient.get('/inventory/items/', { params });
    return response.data;
  }
};

export default distributionApi; 