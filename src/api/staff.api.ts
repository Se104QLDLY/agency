import axiosClient from './axiosClient';
import type { StaffAgencyMap } from '../types/staff.types';

/**
 * Lấy thông tin agency_id cho một user.
 * Endpoint này được giả định là `/staff-agency/?staff_id={userId}` dựa trên
 * các quy ước REST và tên endpoint trong tài liệu.
 * @param userId - ID của người dùng cần tìm
 * @returns Promise chứa agency_id hoặc null nếu không tìm thấy.
 */
export const getAgencyForUser = async (userId: number): Promise<number | null> => {
  try {
    const response = await axiosClient.get<{ results: StaffAgencyMap[] }>(`/staff-agency/`, {
      params: { staff_id: userId }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].agency_id;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to get agency for user ${userId}`, error);
    return null;
  }
}; 