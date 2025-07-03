import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PackageCheck, PackageOpen, BadgeCheck, Loader2, AlertCircle, ListChecks, CalendarDays, ShoppingCart, CheckCircle, Users, Phone, DollarSign, MoreVertical, Building, Box, Plus } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';

// Interface cho từng sản phẩm trong đơn hàng
interface ProductItem {
  name: string;
  quantity: number;
  unit: string;
}

// Interface cho chi tiết phiếu nhập từ API
interface ReceiptDetail {
  receipt_detail_id: number;
  item: number;
  item_name: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

// Interface cho phiếu nhập từ API
interface Receipt {
  receipt_id: number;
  receipt_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  total_amount: string;
  created_at: string | null;
  details?: ReceiptDetail[];
}

// Interface cho đơn hàng xuất kho, bổ sung thêm thông tin đại lý
interface ExportOrder {
  id: string;
  exportDate: string;
  agency: {
    name: string;
    contact: string;
  };
  products: ProductItem[];
  totalAmount: number;
}

const ImportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [orders, setOrders] = useState<ExportOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!isAuthLoading) {
        fetchReceipts();
    }
    if (location.state?.message) {
      setToast({ type: 'success', message: location.state.message });
      setTimeout(() => setToast(null), 5000);
      navigate('/import', { replace: true, state: {} });
    }
  }, [isAuthLoading, user, location.state]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: { agency_id?: number } = {};
      if (user?.account_role === 'agent' && user.agency_id) {
          params.agency_id = user.agency_id;
      }
      
      const response = await axiosClient.get('/inventory/receipts/', { params });
      const receipts: Receipt[] = response.data.results || [];
      
      const receiptDetailsPromises = receipts.map(async (receipt) => {
        try {
          const detailResponse = await axiosClient.get(`/inventory/receipts/${receipt.receipt_id}/`);
          return {
            ...receipt,
            details: detailResponse.data.details || []
          };
        } catch (error) {
          console.warn(`Failed to fetch details for receipt ${receipt.receipt_id}:`, error);
          return receipt;
        }
      });
      
      const receiptsWithDetails = await Promise.all(receiptDetailsPromises);
      
      const convertedOrders: ExportOrder[] = receiptsWithDetails.map(receipt => ({
        id: `PX${String(receipt.receipt_id).padStart(3, '0')}`,
        exportDate: receipt.receipt_date,
        agency: {
          name: receipt.agency_name || `Đại lý ${receipt.agency_id}`,
          contact: 'N/A'
        },
        products: receipt.details?.map((detail: ReceiptDetail) => ({
          name: detail.item_name,
          quantity: detail.quantity,
          unit: 'pcs'
        })) || [],
        totalAmount: parseFloat(receipt.total_amount),
      }));

      setOrders(convertedOrders);

    } catch (err: any) {
      console.error('Error fetching receipts:', err);
      setError(err.response?.data?.detail || 'Không thể tải dữ liệu phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getActionButton = (order: ExportOrder) => {
    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => navigate(`/import/view/${order.id}`)}
          className="px-3 py-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-semibold text-sm"
          title="Xem chi tiết"
        >
          Chi tiết
        </button>
      </div>
    );
  };
  
  const totalReceipts = orders.length;
  const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={fetchReceipts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 text-lg font-semibold animate-fade-in-down ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
          {toast.message}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                        <ListChecks className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Lịch sử Nhập Kho</h1>
                </div>
                {user?.account_role !== 'agent' && (
                    <button
                        onClick={() => navigate('/import/add')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <Plus className="h-5 w-5" />
                        Tạo phiếu nhập
                    </button>
                )}
            </div>
            <p className="text-gray-600 text-base">
                {user?.account_role === 'agent' 
                    ? `Lịch sử các phiếu nhập hàng vào kho tổng cho đại lý của bạn.`
                    : 'Quản lý và xem lại lịch sử các phiếu nhập hàng vào kho tổng.'
                }
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full"><PackageCheck className="h-7 w-7 text-blue-600" /></div>
                <div>
                    <h3 className="text-gray-500 font-semibold">Tổng Số Phiếu Nhập</h3>
                    <p className="text-3xl font-bold text-gray-800">{totalReceipts}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full"><ShoppingCart className="h-7 w-7 text-green-600" /></div>
                <div>
                    <h3 className="text-gray-500 font-semibold">Tổng Giá Trị Đã Nhập</h3>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(totalValue)}</p>
                </div>
            </div>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 text-sm tracking-wider uppercase"><span className="flex items-center gap-2"><ListChecks className="h-5 w-5" />Mã phiếu</span></th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 text-sm tracking-wider uppercase"><span className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Ngày xuất</span></th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 text-sm tracking-wider uppercase"><span className="flex items-center gap-2"><Building className="h-5 w-5" />Đại lý</span></th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-600 text-sm tracking-wider uppercase hidden md:table-cell"><span className="flex items-center gap-2"><Box className="h-5 w-5" />Sản phẩm</span></th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-600 text-sm tracking-wider uppercase"><span className="flex items-center gap-2 justify-end"><DollarSign className="h-5 w-5" />Tổng tiền</span></th>
                  <th className="py-4 px-4 text-center font-semibold text-gray-600 text-sm tracking-wider uppercase"><span className="flex items-center gap-2 justify-center"><MoreVertical className="h-5 w-5" />Hành động</span></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-4 font-bold text-blue-700 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/import/view/${order.id}`)}
                        className="hover:text-blue-900 hover:underline transition-colors"
                      >
                        {order.id}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{order.exportDate}</td>
                    <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
                        <div className="font-semibold">{order.agency.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1"><Phone size={14}/> {order.agency.contact}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        {order.products.length > 0 ? order.products.map((product, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            {product.name} <span className="text-gray-500 font-medium">({product.quantity} {product.unit})</span>
                          </div>
                        )) : (
                          <div className="text-sm text-gray-500">Không có chi tiết</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-4 text-center">
                      {getActionButton(order)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không có phiếu xuất nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
