import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface Agency {
  id: string;
  code: string;
  name: string;
  type: {
    id: number;
    name: string;
  };
  district: string;
  address: string;
  phone: string;
  email: string;
  createdDate: string;
  updatedDate: string;
  manager?: string;
  debt?: number;
  creditLimit?: number;
  status: 'Hoạt động' | 'Tạm dừng' | 'Ngừng hợp tác';
}

const ViewAgencyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - trong thực tế sẽ fetch từ API
  const agency: Agency = {
    id: id || '1',
    code: 'DL001',
    name: 'Đại lý Minh Anh',
    type: {
      id: 1,
      name: 'Cấp 1'
    },
    district: 'Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '0901234567',
    email: 'minhanh@email.com',
    manager: 'Nguyễn Minh Anh',
    debt: 2500000,
    creditLimit: 10000000,
    status: 'Hoạt động',
    createdDate: '2024-01-15',
    updatedDate: '2024-01-20'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoạt động': return 'bg-green-100 text-green-800';
      case 'Tạm dừng': return 'bg-yellow-100 text-yellow-800';
      case 'Ngừng hợp tác': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (typeName: string) => {
    switch (typeName) {
      case 'Cấp 1': return 'bg-blue-100 text-blue-800';
      case 'Cấp 2': return 'bg-green-100 text-green-800';
      case 'Cấp 3': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
            Chi tiết đại lý
          </h1>
          <p className="text-gray-600">Xem thông tin chi tiết đại lý {agency.code}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/agencies/edit/${agency.id}`}
            className="flex items-center px-4 py-2 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-xl transition-colors font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Chỉnh sửa
          </Link>
          <Link
            to="/agencies"
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Quay lại
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-blue-200 p-3 rounded-full mr-3">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-blue-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
              </div>
              <h2 className="text-xl font-bold text-blue-800">Thông tin cơ bản</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Mã đại lý</label>
                <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{agency.code}</p>
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Loại đại lý</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border-2 ${getTypeColor(agency.type.name)} shadow-md`}>{agency.type.name}</span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-blue-700 font-semibold mb-1">Tên đại lý</label>
                <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{agency.name}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-blue-700 font-semibold mb-1">Địa chỉ</label>
                <p className="bg-white px-4 py-3 rounded-lg border text-gray-700 leading-relaxed">{agency.address}</p>
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Quận/Huyện</label>
                <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">{agency.district}</p>
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">Người quản lý</label>
                <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">{agency.manager || 'Chưa có thông tin'}</p>
              </div>
              <div className="md:col-span-2 flex items-center gap-3 mt-2">
                <span className={`px-4 py-1 rounded-full font-bold text-base border-2 ${getStatusColor(agency.status)} shadow`}>{agency.status}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-green-200 p-3 rounded-full mr-3">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-green-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' /></svg>
              </div>
              <h2 className="text-xl font-bold text-green-800">Thông tin liên hệ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-green-700 font-semibold mb-1">Số điện thoại</label>
                <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h2.28a2 2 0 011.789 1.106l1.387 2.773a2 2 0 01-.327 2.327l-1.516 1.516a16.001 16.001 0 006.586 6.586l1.516-1.516a2 2 0 012.327-.327l2.773 1.387A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z' /></svg>
                  <a href={`tel:${agency.phone}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                    {agency.phone}
                  </a>
                </div>
              </div>
              <div>
                <label className="block text-green-700 font-semibold mb-1">Email</label>
                <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-8 0V8a4 4 0 018 0v4' /></svg>
                  <a href={`mailto:${agency.email}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                    {agency.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-100 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-200 p-3 rounded-full mr-3">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-yellow-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7a4 4 0 014-4h8a4 4 0 014 4v7c0 2.21-3.582 4-8 4z' /></svg>
              </div>
              <h2 className="text-xl font-bold text-yellow-800">Thông tin tài chính</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-yellow-700 font-semibold mb-1">Nợ hiện tại</label>
                <p className="bg-white px-4 py-2 rounded-lg border text-red-600 font-bold text-lg">
                  {agency.debt?.toLocaleString('vi-VN')} VND
                </p>
              </div>
              <div>
                <label className="block text-yellow-700 font-semibold mb-1">Hạn mức tín dụng</label>
                <p className="bg-white px-4 py-2 rounded-lg border text-green-600 font-bold text-lg">
                  {agency.creditLimit?.toLocaleString('vi-VN')} VND
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-yellow-700 font-semibold mb-1">Tình trạng nợ</label>
                <div className="bg-white px-4 py-2 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Đã sử dụng:</span>
                    <span className="font-bold">
                      {((agency.debt || 0) / (agency.creditLimit || 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        (agency.debt || 0) / (agency.creditLimit || 1) > 0.8 
                          ? 'bg-red-500' 
                          : (agency.debt || 0) / (agency.creditLimit || 1) > 0.6 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${((agency.debt || 0) / (agency.creditLimit || 1) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Trạng thái</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Tình trạng:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(agency.status)}`}>
                  {agency.status}
                </span>
              </div>
            </div>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Thời gian</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Ngày tạo</label>
                <p className="text-blue-600 font-semibold">{new Date(agency.createdDate).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Cập nhật lần cuối</label>
                <p className="text-gray-800">{new Date(agency.updatedDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác</h3>
            <div className="space-y-3">
              <Link
                to={`/agencies/edit/${agency.id}`}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Chỉnh sửa
              </Link>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Xóa đại lý
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Báo cáo đại lý
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgencyPage;