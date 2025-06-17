import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data for payment detail
  const paymentDetail = {
    id: id,
    code: id === '1' ? 'PT001' : 'PT002',
    agency: {
      name: id === '1' ? 'Đại lý Hà Nội' : 'Đại lý Hồ Chí Minh',
      code: id === '1' ? 'DL001' : 'DL002',
      address: id === '1' 
        ? '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1' 
        : '456 Trần Hưng Đạo, Phường 6, Quận 5',
      phone: id === '1' ? '028 1234 5678' : '028 8765 4321',
      email: id === '1' ? 'daily_hanoi@example.com' : 'daily_hcm@example.com'
    },
    amount: id === '1' ? '5,000,000 VND' : '3,500,000 VND',
    paymentDate: id === '1' ? '15/01/2024' : '14/01/2024',
    paymentMethod: 'Chuyển khoản ngân hàng',
    bankInfo: 'Ngân hàng Vietcombank - Chi nhánh Hà Nội',
    accountNumber: '1234567890',
    accountHolder: 'Công ty ABC',
    notes: 'Thanh toán đơn hàng tháng 1/2024',
    creator: id === '1' ? 'Nguyễn Văn A' : 'Trần Thị B',
    createdDate: id === '1' ? '15/01/2024 08:30' : '14/01/2024 14:15',
    updatedDate: id === '1' ? '15/01/2024 08:30' : '14/01/2024 14:15',
    previousDebt: id === '1' ? '10,000,000 VND' : '8,000,000 VND',
    remainingDebt: id === '1' ? '5,000,000 VND' : '4,500,000 VND'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0h6" /></svg>
              Chi tiết phiếu thu: {paymentDetail.code}
            </h1>
            <p className="text-gray-500 text-sm font-medium">Ngày tạo: {paymentDetail.createdDate}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-150">
              <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V6m0 0l-7 7m7-7l7 7" /></svg>
              In phiếu thu
            </button>
            <Link to="/payment" className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl shadow hover:bg-gray-200 hover:scale-105 transition-all duration-150 flex items-center">
              <svg className="w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Quay lại
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow p-8 mb-6 border border-blue-50">
          <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0h6" /></svg>
            Thông tin phiếu thu
          </h2>
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Mã phiếu thu:</span>
              <span className="font-semibold text-gray-900">{paymentDetail.code}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Ngày thu:</span>
              <span className="text-gray-900">{paymentDetail.paymentDate}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Số tiền:</span>
              <span className="font-bold text-green-600 text-lg">{paymentDetail.amount}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Người tạo:</span>
              <span className="text-gray-900">{paymentDetail.creator}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Ngày tạo:</span>
              <span className="text-gray-900">{paymentDetail.createdDate}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Cập nhật lần cuối:</span>
              <span className="text-gray-900">{paymentDetail.updatedDate}</span>
            </div>
          </div>
        </div>

        {/* Agency Information */}
        <div className="bg-white rounded-xl shadow p-8 mb-6 border border-blue-50">
          <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0v2a4 4 0 01-8 0V7m8 0a4 4 0 00-8 0" /></svg>
            Thông tin đại lý
          </h2>
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Đại lý:</span>
              <span className="font-semibold text-gray-900">{paymentDetail.agency.name}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Mã đại lý:</span>
              <span className="text-gray-900">{paymentDetail.agency.code}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Địa chỉ:</span>
              <span className="text-gray-900">{paymentDetail.agency.address}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Điện thoại:</span>
              <span className="text-gray-900">{paymentDetail.agency.phone}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Email:</span>
              <span className="text-gray-900">{paymentDetail.agency.email}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow p-8 mb-6 border border-blue-50">
          <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
            Phương thức thanh toán
          </h2>
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Phương thức:</span>
              <span className="text-gray-900">{paymentDetail.paymentMethod}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Ngân hàng:</span>
              <span className="text-gray-900">{paymentDetail.bankInfo}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Số tài khoản:</span>
              <span className="text-gray-900">{paymentDetail.accountNumber}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Chủ tài khoản:</span>
              <span className="text-gray-900">{paymentDetail.accountHolder}</span>
            </div>
          </div>
        </div>

        {/* Debt Information */}
        <div className="bg-white rounded-xl shadow p-8 mb-6 border border-blue-50">
          <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 8v8" /></svg>
            Thông tin công nợ
          </h2>
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Nợ trước khi thanh toán:</span>
              <span className="font-bold text-red-600">{paymentDetail.previousDebt}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Số tiền thanh toán:</span>
              <span className="font-bold text-green-600">{paymentDetail.amount}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500 font-medium">Nợ còn lại:</span>
              <span className="font-bold text-red-600">{paymentDetail.remainingDebt}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow p-8 lg:col-span-2 border border-blue-50">
          <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-4-4v8" /></svg>
            Ghi chú
          </h2>
          <p className="text-gray-700 text-base italic">{paymentDetail.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailPage;