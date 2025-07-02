import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth.api';
import type { User, LoginCredentials } from '../api/auth.api';

// Định nghĩa kiểu cho AuthContext
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// Tạo Context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra session khi component được mount lần đầu
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user } = await apiLogin(credentials);
    setUser(user);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Tạo custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};