import axiosClient from './axiosClient';
import type { Agency } from '../types/agency.types';

export interface PaginatedAgencies {
  count: number;
  next: string | null;
  previous: string | null;
  results: Agency[];
}

export const getAgencyById = async (id: number): Promise<Agency> => {
  const response = await axiosClient.get(`/agency/${id}/`);
  return response.data;
};

export const updateAgency = async (id: number, data: Partial<Agency>): Promise<Agency> => {
  const response = await axiosClient.put(`/agency/${id}/`, data);
  return response.data;
};

export const getAgencies = async (): Promise<PaginatedAgencies> => {
  const response = await axiosClient.get<PaginatedAgencies>('/agency/');
  return response.data;
}; 