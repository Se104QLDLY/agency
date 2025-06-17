import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const ExportPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            QUẢN LÝ XUẤT HÀNG
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Chọn chức năng quản lý xuất hàng
            </h2>
            <p className="text-gray-600">
              Lựa chọn chức năng phù hợp để quản lý quy trình xuất hàng của bạn một cách hiệu quả.
            </p>
          </div>

          {/* Function Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution Request Card */}
            <Link
              to="/distribution"
              className="block bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300 hover:border-blue-300"
            >
              <div className="text-center">
                {/* Arrow Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
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
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Yêu cầu phân phối
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Gửi yêu cầu phân phối
                </p>
                <p className="text-gray-600 text-sm text-left">
                  Tạo yêu cầu xuất hàng mới cho đại lý của bạn. 
                  Quản lý và theo dõi các đơn hàng xuất một cách dễ 
                  dàng và hiệu quả.
                </p>
              </div>
            </Link>

            {/* Receive Confirmation Card */}
            <Link
              to="/import"
              className="block bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300 hover:border-blue-300"
            >
              <div className="text-center">
                {/* Arrow Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
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
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Xác nhận nhận hàng
                </h3>
                <p className="text-gray-600 text-sm text-left">
                  Xác nhận các phiếu xuất hàng bạn đã nhận được
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExportPage;