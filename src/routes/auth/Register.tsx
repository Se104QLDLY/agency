import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/auth.api';

interface RegisterFormInputs {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  accountRole: 'admin' | 'staff' | 'agent';
}

const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phone: yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ'),
  address: yup.string().required('Vui lòng nhập địa chỉ'),
  password: yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .matches(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .matches(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  accountRole: yup.string().oneOf(['admin', 'staff', 'agent']).required('Vui lòng chọn vai trò'),
});

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<string[]>([]);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setApiError(null);
    setApiErrors([]);
    const payload = {
      username: data.username,
      password: data.password,
      confirm_password: data.confirmPassword,
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phone,
      address: data.address,
      account_role: data.accountRole,
    };
    try {
      await registerApi(payload);
      navigate('/');
    } catch (err: any) {
      const data = err?.response?.data;
      if (typeof data === 'object' && data !== null) {
        // Gom tất cả lỗi từng trường thành mảng
        const messages = Object.values(data).flat();
        setApiErrors(messages.length ? messages : ['Đăng ký thất bại. Vui lòng thử lại.']);
      } else {
        setApiError(data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border-2 border-cyan-100">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 mb-2 drop-shadow-lg" />
          <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">Đăng ký</h2>
          <p className="text-cyan-700 font-medium">Tạo tài khoản mới để bắt đầu sử dụng hệ thống!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Họ và tên</label>
            <input
              {...register('fullName')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập họ và tên"
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm mt-1">{errors.fullName.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Tên đăng nhập</label>
            <input
              {...register('username')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Email</label>
            <input
              {...register('email')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Số điện thoại</label>
            <input
              {...register('phone')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Địa chỉ</label>
            <input
              {...register('address')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập địa chỉ"
            />
            {errors.address && (
              <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Vai trò tài khoản</label>
            <select
              {...register('accountRole')}
              defaultValue="agent"
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
            >
              <option value="agent">Đại lý (Agent)</option>
              <option value="staff">Nhân viên (Staff)</option>
              <option value="admin">Quản trị (Admin)</option>
            </select>
            {errors.accountRole && (
              <span className="text-red-500 text-sm mt-1">{errors.accountRole.message}</span>
            )}
          </div>

          {/* Hiển thị tất cả lỗi trả về từ backend */}
          {apiErrors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm">
              <ul className="list-disc pl-5">
                {apiErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}
          {apiError && <div className="text-red-500 text-center text-sm mb-2">{apiError}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-cyan-700"
          >
            Đăng ký
          </button>
        </form>

        <div className="flex justify-center mt-6 text-sm">
          <Link to="/login" className="text-cyan-600 hover:underline font-semibold">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;