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
      // Nếu không phải đang ở trang login thì mới redirect
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      // Nếu đang ở trang login thì không reload nữa, chỉ reject lỗi
    }
    return Promise.reject(error);
  }
);

export default axiosClient;