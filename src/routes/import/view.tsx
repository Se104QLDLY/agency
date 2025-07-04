import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Edit3, ArrowLeft, FileText, Trash2, Package, Building, Calendar, User, DollarSign } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

interface ImportProduct {
  receipt_detail_id: number;
  item: number;
  item_name: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

interface ImportRecord {
  receipt_id: number;
  receipt_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  total_amount: string;
  created_at: string | null;
  details: ImportProduct[];
}

const ViewImportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importRecord, setImportRecord] = useState<ImportRecord | null>(null);

  useEffect(() => {
    if (id) {
      fetchImportRecord(id);
    }
  }, [id]);

  const fetchImportRecord = async (receiptId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Extract receipt ID từ URL parameter (có thể là PX001 hoặc 1)
      const numericId = receiptId.startsWith('PX') ? receiptId.slice(2) : receiptId;
      
      const response = await axiosClient.get(`/inventory/receipts/${numericId}/`);
      setImportRecord(response.data);
    } catch (err: any) {
      console.error('Error fetching receipt details:', err);
      setError(err.response?.data?.detail || 'Không thể tải chi tiết phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
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

  const receiptCode = `PX${String(importRecord.receipt_id).padStart(3, '0')}`;

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
                      {new Date(importRecord.receipt_date).toLocaleDateString('vi-VN')}
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
                        <tr key={product.receipt_detail_id}>
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
                      {new Date(importRecord.receipt_date).toLocaleDateString('vi-VN')}
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