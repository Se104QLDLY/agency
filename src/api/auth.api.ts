import axiosClient from './axiosClient';
import { z } from 'zod';

// Định nghĩa kiểu dữ liệu cho thông tin đăng nhập, sử dụng Zod
export const loginSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập không được để trống'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

// Suy ra kiểu TypeScript từ Zod schema
export type LoginCredentials = z.infer<typeof loginSchema>;

// Định nghĩa kiểu dữ liệu cho User
export interface User {
  id: number;
  username?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  account_role?: string;
  agency_id?: number; // For agency users
}

interface LoginResponse {
  user: User;
}

/**
 * Hàm gọi API để đăng nhập
 * @param credentials - Username và password của người dùng
 * @returns Promise chứa thông tin user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await axiosClient.post<LoginResponse>('/auth/login/', credentials);
  return data;
};

/**
 * Hàm gọi API để lấy thông tin user hiện tại (dựa vào cookie)
 * @returns Promise chứa thông tin user
 */
export const getMe = async (): Promise<User> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await axiosClient.get<any>('/auth/me/');
  // Chuẩn hóa dữ liệu trả về từ API
  const normalizedUser: User = {
    id: data.user_id, // Map user_id sang id
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    phone_number: data.phone_number,
    address: data.address,
    account_role: data.account_role,
    agency_id: data.agency_id, // Sẽ là undefined nếu API không trả về
  };
  return normalizedUser;
};

/**
 * Hàm gọi API để đăng xuất
 */
export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout/');
};