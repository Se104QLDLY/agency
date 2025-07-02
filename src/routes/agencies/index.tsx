import React from 'react';
import { User, Mail, Phone, MapPin, BadgeDollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AgencyProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth(); // Lấy user và trạng thái loading từ useAuth

  // 1. Trong khi chờ dữ liệu từ API, hiển thị vòng xoay
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  // 2. Nếu đã tải xong nhưng không có user (chưa đăng nhập), hiển thị thông báo
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Không thể tải hồ sơ</h1>
          <p className="text-gray-600 mt-2">Vui lòng đăng nhập để xem thông tin.</p>
        </div>
      </div>
    );
  }

  // 3. Nếu đã có dữ liệu user, hiển thị thông tin đó ra (chỉ đọc)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="bg-blue-200 p-5 rounded-full shadow-lg mb-3 flex items-center justify-center">
              <User className="h-20 w-20 text-blue-700" />
            </div>
            <div className="text-blue-700 font-bold text-lg flex items-center gap-2">
              <span>{user.full_name}</span>
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mt-1 shadow">ID: {user.id}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide mb-2 flex items-center gap-2">
              <BadgeDollarSign className="h-8 w-8 text-blue-500" /> HỒ SƠ TÀI KHOẢN
            </h1>
            <div className="text-blue-500 font-semibold mb-4">Thông tin cá nhân của bạn</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1 text-blue-700 flex items-center gap-1"><User className="h-4 w-4" />Tên đầy đủ</label>
                <input type="text" value={user.full_name || ''} disabled className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-100 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-blue-700 flex items-center gap-1"><User className="h-4 w-4" />Tên đăng nhập</label>
                <input type="text" value={user.username || ''} disabled className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-100 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-green-700 flex items-center gap-1"><Phone className="h-4 w-4" />Số điện thoại</label>
                <input type="text" value={user.phone_number || ''} disabled className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-gray-100 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-green-700 flex items-center gap-1"><Mail className="h-4 w-4" />Email</label>
                <input type="email" value={user.email || ''} disabled className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-gray-100 text-lg shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-blue-700 flex items-center gap-1"><MapPin className="h-4 w-4" />Địa chỉ</label>
                <input type="text" value={user.address || ''} disabled className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-100 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-indigo-700 flex items-center gap-1"><BadgeDollarSign className="h-4 w-4" />Vai trò</label>
                <input
                  type="text"
                  value={user.account_role || 'Chưa xác định'}
                  disabled
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-100 text-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfilePage;