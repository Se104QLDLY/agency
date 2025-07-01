import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // Nếu đang trong quá trình kiểm tra user (lúc tải lại trang)
  // thì hiển thị một màn hình chờ đơn giản
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Nếu không có user và đã kiểm tra xong, điều hướng về trang đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu có user, cho phép truy cập vào các route con
  return <Outlet />;
};