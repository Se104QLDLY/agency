import { useState } from 'react';
import { useAuth } from './useAuth'; // Import useAuth thật

// Bỏ các interface và mock data cũ

export const useUserAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Lấy user và hàm logout thật từ context

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout(); // Gọi hàm logout thật, nó sẽ tự gọi API và điều hướng
  };

  // Xử lý trường hợp user chưa được tải xong hoặc chưa đăng nhập
  if (!user) {
    // Trả về một trạng thái "trống" để component không bị lỗi
    // Component `ProtectedRoute` sẽ lo việc điều hướng
    return {
      user: null,
      isOpen: false,
      toggleMenu: () => {},
      handleLogout: () => {},
    };
  }

  return {
    user: {
      username: user.username,
      // Tạm thời gán role và avatar, sẽ cập nhật khi có dữ liệu từ API
      role: 'admin', 
      avatar: user.username.charAt(0).toUpperCase(),
    },
    isOpen,
    toggleMenu,
    handleLogout,
  };
}; 