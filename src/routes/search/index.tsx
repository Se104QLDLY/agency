import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Report {
  id: string;
  type: 'Doanh số' | 'Công nợ';
  reportDate: string;
  amount: number;
  creator: string;
  createdDate: string;
}

const ReportsPage: React.FC = () => {
  const [reports] = useState<Report[]>([
    {
      id: 'BC001',
      type: 'Doanh số',
      reportDate: '15/01/2024',
      amount: 1250000000,
      creator: 'Nguyễn Văn A',
      createdDate: '15/01/2024'
    },
    {
      id: 'BC002',
      type: 'Công nợ',
      reportDate: '14/01/2024',
      amount: 458000000,
      creator: 'Trần Thị B',
      createdDate: '14/01/2024'
    },
    {
      id: 'BC003',
      type: 'Doanh số',
      reportDate: '13/01/2024',
      amount: 890000000,
      creator: 'Lê Văn C',
      createdDate: '13/01/2024'
    }
  ]);

  // Calculate statistics
  const totalRevenue = reports
    .filter(report => report.type === 'Doanh số')
    .reduce((sum, report) => sum + report.amount, 0);
  
  const totalDebt = reports
    .filter(report => report.type === 'Công nợ')
    .reduce((sum, report) => sum + report.amount, 0);
  
  const reportCount = reports.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getTypeBadge = (type: string) => {
    if (type === 'Doanh số') {
      return (
        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
          Doanh số
        </span>
      );
    } else {
      return (
        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
          Công nợ
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
          LẬP BÁO CÁO
        </h1>
        <p className="text-gray-600 text-lg">
          Tổng hợp, thống kê và quản lý các báo cáo doanh số, công nợ của đại lý.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100">
          <h3 className="text-gray-700 font-semibold mb-2">Tổng doanh số</h3>
          <p className="text-2xl font-extrabold text-blue-700">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-red-100">
          <h3 className="text-gray-700 font-semibold mb-2">Tổng nợ</h3>
          <p className="text-2xl font-extrabold text-red-600">{formatCurrency(totalDebt)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100">
          <h3 className="text-gray-700 font-semibold mb-2">Số lượng báo cáo</h3>
          <p className="text-2xl font-extrabold text-blue-800">{reportCount}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-blue-800 drop-shadow">Danh sách báo cáo</h2>
          <Link
            to="/reports/add"
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Lập báo cáo
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="border-b border-blue-100">
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Mã báo cáo</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Loại báo cáo</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Ngày báo cáo</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Dữ liệu báo cáo</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Người tạo</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Ngày tạo</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.id} className={index < reports.length - 1 ? "border-b border-blue-50" : ""}>
                  <td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">{report.id}</td>
                  <td className="px-4 py-4">{getTypeBadge(report.type)}</td>
                  <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{report.reportDate}</td>
                  <td className="px-4 py-4 text-gray-700">{formatCurrency(report.amount)}</td>
                  <td className="px-4 py-4 text-gray-700">{report.creator}</td>
                  <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{report.createdDate}</td>
                  <td className="px-4 py-4">
                    <Link
                      to={`/reports/detail/${report.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reports.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Không có báo cáo nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;