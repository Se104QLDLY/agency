import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

// Tạo style riêng cho sidebar
const sidebarStyle = {
  transition: 'width 250ms ease-out',
  willChange: 'width',
  overflowX: 'hidden' as const
};

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  
  // State để kiểm soát sidebar collapse
  const [collapsed, setCollapsed] = useState(() => {
    // Auto-collapse trên mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const sidebarItems: SidebarItem[] = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>,
      label: 'Quản lý xuất hàng',
      path: '/export',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>,
      label: 'Nhận hàng',
      path: '/import',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>,
      label: 'Gửi yêu cầu phân phối',
      path: '/distribution',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>,
      label: 'Lập báo cáo',
      path: '/search',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>,
      label: 'Quản lý thanh toán',
      path: '/payment',
    },
  ];
  
  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      <aside 
        className={`
          ${collapsed ? (isMobile ? '-translate-x-full' : 'w-16') : 'w-64'} 
          ${isMobile ? 'fixed' : 'relative'}
          ${isMobile ? 'z-50' : 'z-10'}
          bg-gradient-to-b from-blue-50 via-white to-cyan-50 
          border-r-4 border-blue-200 min-h-screen shadow-xl 
          ${!isMobile ? 'rounded-tr-3xl rounded-br-3xl' : ''}
          transition-all duration-300 ease-in-out
          ${className}
        `}
      >
        <div className="p-4 relative">
          {/* Header với toggle button */}
          <div className="flex items-center justify-between mb-6">
            {!collapsed ? (
              <Link to="/export" className="flex items-center space-x-3">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto drop-shadow-lg" />
                <span className="text-lg font-extrabold text-blue-800 tracking-wide drop-shadow">Agency</span>
              </Link>
            ) : (
              <Link to="/export" className="mx-auto">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto drop-shadow-lg" />
              </Link>
            )}
            
            {/* Toggle button */}
            <button
              onClick={toggleSidebar}
              className={`
                ${collapsed && !isMobile ? 'absolute -right-3 top-2' : ''}
                p-2 rounded-lg bg-blue-100 hover:bg-blue-200 
                text-blue-600 transition-colors z-10
                ${isMobile ? 'md:hidden' : ''}
              `}
              aria-label={collapsed ? "Mở sidebar" : "Đóng sidebar"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                    flex items-center 
                    ${collapsed ? 'justify-center px-2' : 'space-x-3 px-4'} 
                    py-3 rounded-xl transition-all text-sm font-semibold 
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 shadow-md scale-105'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:scale-105'
                    }
                  `}
                  title={collapsed ? item.label : ''}
                  onClick={() => isMobile && setCollapsed(true)}
                >
                  <div className={`${isActive ? 'text-blue-700' : 'text-gray-400'} flex-shrink-0`}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                  )}
                  {!collapsed && isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;