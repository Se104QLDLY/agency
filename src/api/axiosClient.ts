import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Optional: Thêm interceptor để xử lý lỗi chung
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về response nếu không có lỗi
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Khi API trả về 401, nghĩa là session đã hết hạn hoặc không hợp lệ.
      // Dòng dưới đây sẽ reload lại trang, trình duyệt sẽ tự động
      // chuyển hướng đến trang đăng nhập nếu route được bảo vệ.
      console.error('Unauthorized! Reloading page...');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;