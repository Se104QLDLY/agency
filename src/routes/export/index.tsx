import React from 'react';
import { Link } from 'react-router-dom';
import { PackagePlus, CheckCircle } from 'lucide-react';

const ExportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100 mb-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-3 drop-shadow uppercase tracking-widest text-center">
          QUẢN LÝ XUẤT HÀNG
        </h1>
        <p className="text-gray-600 text-lg text-center max-w-2xl">
          Lựa chọn chức năng phù hợp để quản lý quy trình xuất hàng của bạn một cách hiệu quả.
        </p>
      </div>

      {/* Function Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Distribution Request Card */}
        <Link
          to="/distribution"
          className="group block bg-white rounded-2xl shadow-xl p-10 border-2 border-blue-100 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-200 transition-all">
              <PackagePlus className="h-10 w-10 text-blue-600 group-hover:text-blue-800 transition-all" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-2 tracking-wide">
              Yêu cầu phân phối
            </h3>
            <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow">
              Đơn hàng mới
            </span>
            <p className="text-gray-600 text-base mb-2 text-center">
              Gửi yêu cầu xuất hàng mới cho đại lý của bạn. Quản lý và theo dõi các đơn hàng xuất một cách dễ dàng và hiệu quả.
            </p>
          </div>
        </Link>

        {/* Receive Confirmation Card */}
        <Link
          to="/import"
          className="group block bg-white rounded-2xl shadow-xl p-10 border-2 border-blue-100 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-200 transition-all">
              <CheckCircle className="h-10 w-10 text-blue-600 group-hover:text-blue-800 transition-all" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-2 tracking-wide">
              Xác nhận nhận hàng
            </h3>
            <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow">
              Đã nhận hàng
            </span>
            <p className="text-gray-600 text-base mb-2 text-center">
              Quản lý, xác nhận và theo dõi các phiếu xuất hàng đã nhận một cách nhanh chóng, chính xác.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ExportPage;