import React from 'react';
import { Link } from 'react-router-dom';

const ExportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
          QUẢN LÝ XUẤT HÀNG
        </h1>
        <p className="text-gray-600 text-lg">
          Lựa chọn chức năng phù hợp để quản lý quy trình xuất hàng của bạn một cách hiệu quả.
        </p>
      </div>

      {/* Function Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Distribution Request Card */}
        <Link
          to="/distribution"
          className="block bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border-2 border-blue-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Yêu cầu phân phối
            </h3>
            <p className="text-gray-600 text-base mb-2">
              Gửi yêu cầu phân phối
            </p>
            <p className="text-gray-600 text-sm text-center">
              Tạo yêu cầu xuất hàng mới cho đại lý của bạn. Quản lý và theo dõi
              các đơn hàng xuất một cách dễ dàng và hiệu quả.
            </p>
          </div>
        </Link>

        {/* Receive Confirmation Card */}
        <Link
          to="/import"
          className="block bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border-2 border-blue-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Xác nhận nhận hàng
            </h3>
            <p className="text-gray-600 text-base mb-2">
              Xác nhận các phiếu xuất hàng bạn đã nhận được
            </p>
            <p className="text-gray-600 text-sm text-center">
              Quản lý, xác nhận và theo dõi các phiếu xuất hàng đã nhận một cách
              nhanh chóng, chính xác.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ExportPage;