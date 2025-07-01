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
  username: string;
  email?: string; // email có thể có hoặc không
  // Thêm các thuộc tính khác của user nếu có, ví dụ: name, role, ...
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
  const { data } = await axiosClient.get<User>('/auth/me/');
  return data;
};

/**
 * Hàm gọi API để đăng xuất
 */
export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout/');
};