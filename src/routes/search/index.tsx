import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

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
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            LẬP BÁO CÁO
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 font-medium mb-2">Tổng doanh số</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          {/* Total Debt */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 font-medium mb-2">Tổng nợ</h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDebt)}
            </p>
          </div>

          {/* Report Count */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 font-medium mb-2">Số lượng báo cáo</h3>
            <p className="text-2xl font-bold text-gray-900">
              {reportCount}
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Danh sách báo cáo</h2>
            <Link
              to="/reports/add"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Lập báo cáo
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Mã báo cáo</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Loại báo cáo</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Ngày báo cáo</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Dữ liệu báo cáo</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Người tạo</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Ngày tạo</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report.id} className={index < reports.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-4 py-4">
                      {getTypeBadge(report.type)}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {report.reportDate}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {formatCurrency(report.amount)}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {report.creator}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {report.createdDate}
                    </td>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;