import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, FileText, FileSpreadsheet, FilePlus2, Users, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Clock, User, Eye, Loader2, PieChart, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getSalesReport, getDebtReport } from '../../api/report.api';
import { getAgencyById } from '../../api/agency.api';

// --- DI CHUYỂN INTERFACE VÀO ĐÂY ---
interface SalesReportItem {
  month: string;
  total_revenue: number;
  total_issues: number;
  new_debt_generated: number;
}

interface DebtReportData {
  agency_id: number;
  agency_name: string;
  total_debt: number;
  debt_aging_buckets?: {
    "0-30": number;
    "31-60": number;
    "61-90": number;
    "90+": number;
  };
}
// --- KẾT THÚC DI CHUYỂN ---

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';

const AgencyReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState<SalesReportItem[]>([]);
  const [debtData, setDebtData] = useState<DebtReportData | null>(null);
  const [agencyName, setAgencyName] = useState<string>('...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.agency_id) {
        // Handle cases where user is not logged in or is not an agent
        // For now, we just stop loading and maybe show a message
        setLoading(false);
        setError("Không thể xác định đại lý, vui lòng đăng nhập bằng tài khoản đại lý.");
        return;
      }

      try {
        setLoading(true);
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        const salesParams = {
          agency_id: user.agency_id,
          from: sixMonthsAgo.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0],
        };
        
        const debtParams = { agency_id: user.agency_id };

        const [salesResponse, debtResponse] = await Promise.all([
          getSalesReport(salesParams),
          getDebtReport(debtParams),
        ]);

        setSalesData(salesResponse);
        setDebtData(debtResponse);
        setError(null);

        // Nếu debtData không có agency_name, fetch từ API agency
        if (debtResponse?.agency_name) {
          setAgencyName(debtResponse.agency_name);
        } else {
          // Fetch agency name by id
          const agency = await getAgencyById(user.agency_id);
          setAgencyName(agency.name);
        }
      } catch (err) {
        console.error("Failed to fetch report data:", err);
        setError("Tải dữ liệu báo cáo thất bại. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
  
  const totalRevenue = salesData.reduce((sum, item) => sum + item.total_revenue, 0);
  const totalDebt = debtData?.total_debt ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
        <p className="ml-4 text-xl text-gray-700">Đang tải dữ liệu báo cáo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center text-center">
        <div>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600">Đã xảy ra lỗi</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 mb-8 flex flex-col gap-2 items-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-2 shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1 drop-shadow uppercase tracking-wide">
          BÁO CÁO ĐẠI LÝ: {agencyName}
        </h1>
        <p className="text-gray-600 text-lg text-center max-w-2xl">Tổng hợp, thống kê và quản lý các báo cáo doanh thu, tồn kho, công nợ và hoạt động của đại lý.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100 flex flex-col items-center">
          <TrendingUp className="h-8 w-8 text-green-600 mb-2"/>
          <h3 className="text-gray-700 font-semibold mb-1">Tổng doanh thu (6 tháng gần nhất)</h3>
          <p className="text-2xl font-extrabold text-green-700">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-red-100 flex flex-col items-center">
          <TrendingDown className="h-8 w-8 text-red-600 mb-2"/>
          <h3 className="text-gray-700 font-semibold mb-1">Tổng công nợ hiện tại</h3>
          <p className="text-2xl font-extrabold text-red-600">{formatCurrency(totalDebt)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100 flex flex-col items-center">
          <Calendar className="h-8 w-8 text-blue-600 mb-2"/>
          <h3 className="text-gray-700 font-semibold mb-1">Kỳ báo cáo</h3>
          <p className="text-2xl font-extrabold text-blue-800">6 tháng gần nhất</p>
        </div>
      </div>
      
      {/* SECTION THAY THẾ CHO DANH SÁCH BÁO CÁO VÀ BIỂU ĐỒ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Cột trái: Bảng doanh số theo tháng */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><BarChart className="h-5 w-5 text-blue-600"/>Thống kê doanh số theo tháng</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Tháng</th>
                  <th className="py-3 px-4 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Số Phiếu Xuất</th>
                  <th className="py-3 px-4 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Nợ Mới Phát Sinh</th>
                  <th className="py-3 px-4 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Doanh Thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesData.map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800">{item.month}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{item.total_issues}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.new_debt_generated)}</td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(item.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Cột phải: Biểu đồ cơ cấu công nợ */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><PieChart className="h-5 w-5 text-blue-600"/>Cơ cấu công nợ</h3>
            {debtData && debtData.total_debt > 0 ? (
                <div className="w-full">
                  {/* Đây là component biểu đồ tròn, bạn có thể thay thế bằng thư viện như Recharts */}
                  <DebtPieChart data={debtData.debt_aging_buckets} total={debtData.total_debt} />
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                    <p className="font-semibold">Không có công nợ.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Một component con để vẽ biểu đồ tròn bằng SVG
const DebtPieChart: React.FC<{ data?: DebtReportData['debt_aging_buckets'], total: number }> = ({ data, total }) => {
  if (!data) {
    return null; // Don't render if data is not available
  }

  const categories = [
    { key: '0-30' as const, color: '#4ade80', label: 'Nợ trong hạn (0-30 ngày)' },
    { key: '31-60' as const, color: '#facc15', label: 'Quá hạn (31-60 ngày)' },
    { key: '61-90' as const, color: '#fb923c', label: 'Quá hạn (61-90 ngày)' },
    { key: '90+' as const, color: '#f87171', label: 'Quá hạn nặng (Trên 90 ngày)' },
  ];

  let accumulated = 0;
  const segments = categories.map(cat => {
    const percentage = (data[cat.key] / total) * 100;
    const startAngle = (accumulated / 100) * 360;
    accumulated += percentage;
    const endAngle = (accumulated / 100) * 360;
    return { ...cat, percentage, startAngle, endAngle };
  }).filter(segment => segment.percentage > 0);

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-48 h-48">
        <svg viewBox="-1.2 -1.2 2.4 2.4" className="transform -rotate-90">
          {segments.map(segment => {
            const [startX, startY] = getCoordinatesForPercent(segment.startAngle / 360);
            const [endX, endY] = getCoordinatesForPercent(segment.endAngle / 360);
            const largeArcFlag = segment.percentage > 50 ? 1 : 0;
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');
            return <path key={segment.key} d={pathData} fill={segment.color} />;
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        {segments.map(segment => (
          <div key={segment.key} className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }}></span>
            <span className="font-semibold text-gray-700">{segment.label}:</span>
            <span className="font-bold text-gray-900">{formatCurrency(data[segment.key])}</span>
            <span className="text-gray-500">({segment.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyReportsPage;
