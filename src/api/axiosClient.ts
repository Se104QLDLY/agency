import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Optional: Thêm interceptor để xử lý lỗi chung
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về response nếu không có lỗi
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Khi API trả về 401, nghĩa là session đã hết hạn hoặc không hợp lệ.
      // Dòng dưới đây sẽ reload lại trang, trình duyệt sẽ tự động
      // chuyển hướng đến trang đăng nhập nếu route được bảo vệ.
      // Hoặc bạn có thể chuyển hướng tường minh:
      // window.location.href = '/login';
      console.error('Unauthorized! Redirecting...');
      // Bạn có thể thêm logic xóa state người dùng ở đây
    }
    return Promise.reject(error);
  }
);

export default axiosClient;