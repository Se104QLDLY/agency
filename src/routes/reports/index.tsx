import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface Report {
  id: string;
  title: string;
  type: 'Doanh thu' | 'Tồn kho' | 'Công nợ' | 'Hoạt động';
  period: string;
  status: 'Hoàn thành' | 'Đang xử lý' | 'Lỗi';
  creator: string;
  createdDate: string;
  updatedDate: string;
  description?: string;
  amount?: number;
}

const ReportsIndexPage: React.FC = () => {
  const [reports] = useState<Report[]>([
    {
      id: 'BC001',
      title: 'Báo cáo doanh thu tháng 1/2024',
      type: 'Doanh thu',
      period: 'Tháng 1/2024',
      status: 'Hoàn thành',
      creator: 'Nguyễn Văn A',
      createdDate: '15/01/2024',
      updatedDate: '15/01/2024',
      description: 'Báo cáo tổng hợp doanh thu tháng 1/2024',
      amount: 1250000000
    },
    {
      id: 'BC002',
      title: 'Báo cáo công nợ quý 1/2024',
      type: 'Công nợ',
      period: 'Quý 1/2024',
      status: 'Đang xử lý',
      creator: 'Trần Thị B',
      createdDate: '14/01/2024',
      updatedDate: '14/01/2024',
      description: 'Báo cáo công nợ quý 1/2024',
      amount: 458000000
    },
    {
      id: 'BC003',
      title: 'Báo cáo tồn kho tháng 1/2024',
      type: 'Tồn kho',
      period: 'Tháng 1/2024',
      status: 'Hoàn thành',
      creator: 'Lê Văn C',
      createdDate: '13/01/2024',
      updatedDate: '13/01/2024',
      description: 'Báo cáo tồn kho tháng 1/2024',
      amount: 890000000
    }
  ]);

  // Thống kê
  const totalRevenue = reports.filter(r => r.type === 'Doanh thu').reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalDebt = reports.filter(r => r.type === 'Công nợ').reduce((sum, r) => sum + (r.amount || 0), 0);
  const reportCount = reports.length;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + ' VND';

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Doanh thu':
        return (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
            Doanh thu
          </span>
        );
      case 'Công nợ':
        return (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
            Công nợ
          </span>
        );
      case 'Tồn kho':
        return (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
            Tồn kho
          </span>
        );
      case 'Hoạt động':
        return (
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-lg">
            Hoạt động
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
            Hoàn thành
          </span>
        );
      case 'Đang xử lý':
        return (
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-lg">
            Đang xử lý
          </span>
        );
      case 'Lỗi':
        return (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
            Lỗi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6" style={{ overflow: 'visible' }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
            LẬP BÁO CÁO
          </h1>
          <p className="text-gray-600 text-lg">
            Tổng hợp, thống kê và quản lý các báo cáo doanh thu, tồn kho, công nợ và hoạt động của đại lý.
          </p>
        </div>

        {/* Card thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <h3 className="text-gray-700 font-semibold mb-2">Tổng doanh thu</h3>
            <p className="text-2xl font-extrabold text-blue-700">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-red-100">
            <h3 className="text-gray-700 font-semibold mb-2">Tổng công nợ</h3>
            <p className="text-2xl font-extrabold text-red-600">{formatCurrency(totalDebt)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-gray-700 font-semibold mb-2">Số lượng báo cáo</h3>
            <p className="text-2xl font-extrabold text-blue-800">{reportCount}</p>
          </div>
        </div>

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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Mã báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Kỳ báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Dữ liệu báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Người tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(report.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(report.amount || 0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.creator}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/reports/detail/${report.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
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

        {reports.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Không có báo cáo nào.</p>
          </div>
        )}

        {/* Thêm 2 card thống kê dưới danh sách báo cáo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Danh sách đại lý có doanh số cao nhất */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Danh sách đại lý có doanh số cao nhất</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">MÃ ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">TÊN ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-right text-blue-700 font-semibold">DOANH SỐ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'DL101', name: 'Đại lý 1', revenue: 45000000 },
                    { id: 'DL102', name: 'Đại lý 2', revenue: 40000000 },
                    { id: 'DL103', name: 'Đại lý 3', revenue: 35000000 },
                    { id: 'DL104', name: 'Đại lý 4', revenue: 30000000 },
                    { id: 'DL105', name: 'Đại lý 5', revenue: 25000000 }
                  ].map((agency) => (
                    <tr key={agency.id} className="border-b last:border-0">
                      <td className="py-2 px-4 font-bold text-blue-900 whitespace-nowrap">{agency.id}</td>
                      <td className="py-2 px-4 text-gray-800 whitespace-nowrap">{agency.name}</td>
                      <td className="py-2 px-4 text-right font-semibold text-blue-700 whitespace-nowrap">{agency.revenue.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danh sách đại lý có công nợ cao nhất */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Danh sách đại lý có công nợ cao nhất</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">MÃ ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">TÊN ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-right text-blue-700 font-semibold">SỐ TIỀN CÔNG NỢ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'DL101', name: 'Đại lý 1', debt: 45000000 },
                    { id: 'DL102', name: 'Đại lý 2', debt: 40000000 },
                    { id: 'DL103', name: 'Đại lý 3', debt: 35000000 },
                    { id: 'DL104', name: 'Đại lý 4', debt: 30000000 },
                    { id: 'DL105', name: 'Đại lý 5', debt: 25000000 }
                  ].map((agency) => (
                    <tr key={agency.id} className="border-b last:border-0">
                      <td className="py-2 px-4 font-bold text-blue-900 whitespace-nowrap">{agency.id}</td>
                      <td className="py-2 px-4 text-gray-800 whitespace-nowrap">{agency.name}</td>
                      <td className="py-2 px-4 text-right font-semibold text-blue-700 whitespace-nowrap">{agency.debt.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsIndexPage;
