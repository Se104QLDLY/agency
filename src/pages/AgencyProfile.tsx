import React, { useState } from 'react';

// Giả lập dữ liệu đại lý (có thể thay bằng API thực tế)
const mockAgency = {
  id: 'DL001',
  name: 'Đại lý Hà Nội',
  address: '123 Đường ABC, Quận 1, Hà Nội',
  phone: '0123 456 789',
  email: 'dailyhanoi@example.com',
  owner: 'Nguyễn Văn A',
  taxCode: '123456789',
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
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mt-8">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">HỒ SƠ ĐẠI LÝ</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-blue-700">Tên đại lý</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-blue-700">Địa chỉ</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-blue-700">Số điện thoại</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-blue-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-blue-700">Chủ đại lý</label>
          <input type="text" name="owner" value={form.owner} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-blue-700">Mã số thuế</label>
          <input type="text" name="taxCode" value={form.taxCode} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
        </div>
        {success && <div className="text-green-600 font-semibold">{success}</div>}
        <div className="flex justify-end gap-4">
          {!editing ? (
            <button type="button" className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg" onClick={() => setEditing(true)}>
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button type="button" className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold text-lg" onClick={() => setEditing(false)} disabled={loading}>
                Hủy
              </button>
              <button type="submit" className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AgencyProfilePage;
