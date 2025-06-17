import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../../hooks/useLoginForm';

const Login: React.FC = () => {
  const {
    loginType,
    setLoginType,
    isLoggedIn,
    showAccountMenu,
    userName,
    toggleAccountMenu,
    handleLogout,
    register,
    handleSubmit,
    errors,
    onSubmit
  } = useLoginForm();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Đăng nhập
          </h2>
          <p className="text-gray-600">
            Vui lòng đăng nhập để tiếp tục
          </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-2 rounded-md text-center transition-all ${
              loginType === 'admin' 
                ? 'bg-white text-blue-600 shadow-sm font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setLoginType('client')}
            className={`flex-1 py-2 rounded-md text-center transition-all ${
              loginType === 'client' 
                ? 'bg-white text-blue-600 shadow-sm font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Client
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Tên đăng nhập</label>
            <input
              {...register('username')}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50 placeholder:text-blue-300"
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>
            )}
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50 placeholder:text-blue-300"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-blue-700"
          >
            Đăng nhập
          </button>
        </form>
        <div className="flex justify-between mt-6 text-sm">
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">Chưa có tài khoản?</Link>
          <Link to="/forgot-password" className="text-blue-400 hover:underline">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;