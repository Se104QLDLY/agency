import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Edit3, ArrowLeft, FileText, Trash2, Package, Building, Calendar, User, DollarSign } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';

interface ImportProduct {
  issue_detail_id: number;
  item: number;
  item_name: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

interface ImportRecord {
  issue_id: number;
  issue_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  total_amount: string;
  created_at: string | null;
  details: ImportProduct[];
  status: string;
  status_reason?: string;
}

const ViewImportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importRecord, setImportRecord] = useState<ImportRecord | null>(null);

  useEffect(() => {
    if (!isAuthLoading && id) {
      fetchImportRecord(id);
    }
  }, [id, isAuthLoading, user]);

  const fetchImportRecord = async (issueId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Kiểm tra quyền truy cập: chỉ agent có agency_id mới được xem dữ liệu
      if (user?.account_role === 'agent' && !user.agency_id) {
        console.log('Agency Import View: Agent without agency_id, blocking access');
        setError('Tài khoản của bạn chưa được liên kết với đại lý nào. Vui lòng liên hệ quản trị viên.');
        return;
      }

      // Extract issue ID từ URL parameter (có thể là PX001 hoặc 1)
      const numericId = issueId.startsWith('PX') ? issueId.slice(2) : issueId;
      
      console.log(`Agency Import View: Loading issue ${numericId} for user ${user?.username} (agency_id: ${user?.agency_id})`);
      
      const response = await axiosClient.get(`/inventory/issues/${numericId}/`);
      const record = response.data;
      
      // Kiểm tra quyền truy cập: agent chỉ được xem phiếu của agency mình
      if (user?.account_role === 'agent' && user.agency_id && record.agency_id !== user.agency_id) {
        console.log(`Agency Import View: Access denied - user agency_id ${user.agency_id} != record agency_id ${record.agency_id}`);
        setError('Bạn không có quyền xem phiếu nhập này.');
        return;
      }
      
      setImportRecord(record);
    } catch (err: any) {
      console.error('Error fetching receipt details:', err);
      setError(err.response?.data?.detail || 'Không thể tải chi tiết phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Đang tải chi tiết phiếu nhập...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auth check
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <p className="text-red-600">Vui lòng đăng nhập để xem thông tin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={() => navigate('/import')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!importRecord) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Không tìm thấy phiếu nhập</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN').format(Number(amount)) + ' VND';
  };

  const receiptCode = `PX${String(importRecord.issue_id).padStart(3, '0')}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'postponed':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'postponed':
        return 'Tạm hoãn';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-blue-800 mb-1 drop-shadow uppercase tracking-wide">
                  Chi tiết phiếu nhập
                </h1>
                <p className="text-gray-600">Xem thông tin chi tiết phiếu nhập {receiptCode}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/import')}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-semibold"
              >
                <ArrowLeft className="h-5 w-5" />
                Quay lại
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
                <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông tin phiếu nhập
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Mã phiếu nhập</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{receiptCode}</p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Ngày nhập hàng</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">
                      {new Date(importRecord.issue_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Đại lý</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">
                      {importRecord.agency_name || `Đại lý ${importRecord.agency_id}`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Mã đại lý</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">
                      DL{String(importRecord.agency_id).padStart(3, '0')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Người tạo</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">
                      {importRecord.user_name || `User ${importRecord.user_id}`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Ngày tạo</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">
                      {importRecord.created_at 
                        ? new Date(importRecord.created_at).toLocaleDateString('vi-VN')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Danh sách sản phẩm
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-green-200 rounded-lg">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-green-800 font-semibold">Tên sản phẩm</th>
                        <th className="px-4 py-3 text-right text-green-800 font-semibold">Số lượng</th>
                        <th className="px-4 py-3 text-right text-green-800 font-semibold">Đơn giá</th>
                        <th className="px-4 py-3 text-right text-green-800 font-semibold">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100">
                      {importRecord.details?.map((product) => (
                        <tr key={product.issue_detail_id}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{product.item_name}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{product.quantity.toLocaleString('vi-VN')}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(product.unit_price)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(product.line_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-green-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-green-800">Tổng cộng:</td>
                        <td className="px-4 py-3 text-right font-bold text-green-600 text-lg">
                          {formatCurrency(importRecord.total_amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Thông tin tổng quan
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Tình trạng:</span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                      Đã hoàn thành
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Tổng giá trị:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(importRecord.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Số sản phẩm:</span>
                    <span className="text-gray-800 font-semibold">
                      {importRecord.details?.length || 0} mặt hàng
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Thông tin thời gian
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Ngày nhập hàng</label>
                    <p className="text-blue-600 font-semibold">
                      {new Date(importRecord.issue_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {importRecord.created_at && (
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Ngày tạo phiếu</label>
                      <p className="text-gray-800">
                        {new Date(importRecord.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Người tạo</label>
                    <p className="text-gray-800 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {importRecord.user_name || `User ${importRecord.user_id}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác</h3>
                <div className="space-y-3">
                  {/* Print button removed per requirements */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImportPage;