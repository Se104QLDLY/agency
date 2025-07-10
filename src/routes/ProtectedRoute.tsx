import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // ✅ Khi không có user sau khi load, luôn redirect về login page
    if (!isLoading && !user) {
      const loginPageUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:5179/login';
      window.location.href = loginPageUrl;
      return;
    }

    // ✅ Nếu có user nhưng sai role thì điều hướng về app phù hợp
    if (!isLoading && user && user.account_role !== 'agent') {
      console.log('Agency app: Wrong role, redirecting to appropriate app');

      const adminAppUrl = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:5178';
      const staffAppUrl = import.meta.env.VITE_STAFF_APP_URL || 'http://localhost:5176';
      const loginPageUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:5179';

      switch (user.account_role) {
        case 'admin':
          window.location.href = adminAppUrl;
          break;
        case 'staff':
          window.location.href = `${staffAppUrl}/`;
          break;
        default:
          window.location.href = loginPageUrl;
      }
      return;
    }
  }, [user, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!user || user.account_role !== 'agent') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Đang chuyển hướng...</div>
      </div>
    );
  }

  console.log('Agency app: User authenticated and has correct role');
  return <Outlet />;
};
