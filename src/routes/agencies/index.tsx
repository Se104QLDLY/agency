import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, BadgeDollarSign, Edit2, Save, XCircle, Loader2, CheckCircle } from 'lucide-react';

// Giả lập dữ liệu đại lý (có thể thay bằng API thực tế)
const mockAgency = {
  id: 'DL001',
  name: 'Đại lý Hà Nội',
  address: '123 Đường ABC, Quận 1, Hà Nội',
  phone: '0123 456 789',
  email: 'dailyhanoi@example.com',
  owner: 'Nguyễn Văn A',
  taxCode: '123456789',
  type: 'Đại lý cấp 1', // Thêm trường loại đại lý
};

const AgencyProfilePage: React.FC = () => {
  const [form, setForm] = useState(mockAgency);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEditing(false);
      setSuccess('Cập nhật hồ sơ thành công!');
      setTimeout(() => setSuccess(''), 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-10 px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="bg-blue-200 p-5 rounded-full shadow-lg mb-3 flex items-center justify-center">
              <User className="h-20 w-20 text-blue-700" />
            </div>
            <div className="text-blue-700 font-bold text-lg flex items-center gap-2">
              <span>{form.name}</span>
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mt-1 shadow">Mã: {form.id}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide mb-2 flex items-center gap-2">
              <BadgeDollarSign className="h-8 w-8 text-blue-500" /> HỒ SƠ ĐẠI LÝ
            </h1>
            <div className="text-blue-500 font-semibold mb-4">Thông tin tổng quan đại lý</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1 text-blue-700 flex items-center gap-1"><User className="h-4 w-4" />Tên đại lý</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-blue-700 flex items-center gap-1"><User className="h-4 w-4" />Chủ đại lý</label>
                <input type="text" name="owner" value={form.owner} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-green-700 flex items-center gap-1"><Phone className="h-4 w-4" />Số điện thoại</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-green-700 flex items-center gap-1"><Mail className="h-4 w-4" />Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-blue-700 flex items-center gap-1"><MapPin className="h-4 w-4" />Địa chỉ</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-yellow-700 flex items-center gap-1"><BadgeDollarSign className="h-4 w-4" />Mã số thuế</label>
                <input type="text" name="taxCode" value={form.taxCode} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-indigo-700 flex items-center gap-1"><BadgeDollarSign className="h-4 w-4" />Loại đại lý</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange as any}
                  disabled={!editing}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm bg-white"
                >
                  <option value="Đại lý cấp 1">Đại lý cấp 1</option>
                  <option value="Đại lý cấp 2">Đại lý cấp 2</option>
                </select>
              </div>
            </div>
            {success && <div className="flex items-center gap-2 text-green-600 font-semibold mt-4"><CheckCircle className="h-5 w-5 animate-bounce" />{success}</div>}
            <div className="flex justify-end gap-4 mt-8">
              {!editing ? (
                <button type="button" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-md flex items-center gap-2" onClick={() => setEditing(true)}>
                  <Edit2 className="h-5 w-5" />
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button type="button" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold text-lg shadow-md flex items-center gap-2" onClick={() => setEditing(false)} disabled={loading}>
                    <XCircle className="h-5 w-5" />
                    Hủy
                  </button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-md flex items-center gap-2" disabled={loading}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Lưu thay đổi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgencyProfilePage;