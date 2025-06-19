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
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-12 border-2 border-blue-100 mt-10">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="bg-blue-200 p-4 rounded-full shadow-lg mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div className="text-blue-700 font-bold text-lg">{form.name}</div>
            <div className="text-blue-400 text-sm">Mã: {form.id}</div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide mb-2">HỒ SƠ ĐẠI LÝ</h1>
            <div className="text-blue-500 font-semibold mb-4">Thông tin tổng quan đại lý</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1 text-blue-700">Tên đại lý</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-blue-700">Chủ đại lý</label>
                <input type="text" name="owner" value={form.owner} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-green-700">Số điện thoại</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-green-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-blue-700">Địa chỉ</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-yellow-700">Mã số thuế</label>
                <input type="text" name="taxCode" value={form.taxCode} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg shadow-sm" />
              </div>
            </div>
            {success && <div className="text-green-600 font-semibold mt-4">{success}</div>}
            <div className="flex justify-end gap-4 mt-8">
              {!editing ? (
                <button type="button" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-md flex items-center gap-2" onClick={() => setEditing(true)}>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 20 20' stroke='currentColor'><path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' /></svg>
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button type="button" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold text-lg shadow-md" onClick={() => setEditing(false)} disabled={loading}>
                    Hủy
                  </button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-md flex items-center gap-2" disabled={loading}>
                    {loading && <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>}
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