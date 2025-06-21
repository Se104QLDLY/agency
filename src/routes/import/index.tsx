import React, { useState } from 'react';
import { PackageCheck, PackageOpen, BadgeCheck, Loader2, AlertCircle, ListChecks, CalendarDays, ShoppingCart, CheckCircle, Users, Phone, DollarSign, MoreVertical, Building, Box } from 'lucide-react';

// Interface cho từng sản phẩm trong đơn hàng
interface ProductItem {
  name: string;
  quantity: number;
  unit: string;
}

// Interface cho đơn hàng xuất kho, bổ sung thêm thông tin đại lý
interface ExportOrder {
  id: string;
  exportDate: string;
  agency: { // Thêm thông tin đại lý
    name: string;
    contact: string;
  };
  products: ProductItem[];
  totalAmount: number;
  status: 'Đang chờ nhận' | 'Đã nhận';
}

const ImportPage: React.FC = () => {
  // Dữ liệu mẫu với cấu trúc mới
  const [orders, setOrders] = useState<ExportOrder[]>([
    {
      id: 'PX001',
      exportDate: '2024-07-21',
      agency: { name: 'Đại lý A - Nguyễn Văn An', contact: '0901234567' },
      products: [
        { name: 'Sản phẩm A', quantity: 10, unit: 'thùng' },
        { name: 'Sản phẩm B', quantity: 5, unit: 'kg' }
      ],
      totalAmount: 18500000,
      status: 'Đang chờ nhận'
    },
    {
      id: 'PX002',
      exportDate: '2024-07-20',
      agency: { name: 'Đại lý B - Trần Thị Bình', contact: '0912345678' },
      products: [
        { name: 'Sản phẩm C', quantity: 20, unit: 'chai' },
        { name: 'Sản phẩm D', quantity: 8, unit: 'hộp' }
      ],
      totalAmount: 25700000,
      status: 'Đang chờ nhận'
    },
    {
      id: 'PX003',
      exportDate: '2024-07-19',
      agency: { name: 'Đại lý C - Lê Văn Cường', contact: '0987654321' },
      products: [
        { name: 'Sản phẩm E', quantity: 15, unit: 'gói' }
      ],
      totalAmount: 12300000,
      status: 'Đã nhận'
    }
  ]);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Hàm xử lý khi nhấn nút nhận hàng
  const handleReceiveOrder = async (orderId: string) => {
    try {
      setLoadingId(orderId);
      // Giả lập cuộc gọi API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cập nhật trạng thái đơn hàng
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'Đã nhận' as const }
            : order
        )
      );
      
      setToast({ type: 'success', message: `Đã nhận hàng cho phiếu ${orderId} thành công!` });
    } catch (error) {
      setToast({ type: 'error', message: 'Có lỗi xảy ra khi nhận hàng!' });
    } finally {
        setLoadingId(null);
        setTimeout(() => setToast(null), 3000);
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  // Component hiển thị huy hiệu trạng thái
  const getStatusBadge = (status: string) => {
    if (status === 'Đang chờ nhận') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-lg shadow-sm">
          <PackageOpen className="h-4 w-4" /> Đang chờ nhận
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg shadow-sm">
        <BadgeCheck className="h-4 w-4" /> Đã nhận
      </span>
    );
  };

  // Component hiển thị nút hành động
  const getActionButton = (order: ExportOrder) => {
    if (order.status === 'Đang chờ nhận') {
      return (
        <button
          onClick={() => handleReceiveOrder(order.id)}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loadingId === order.id}
        >
          {loadingId === order.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
          Nhận hàng
        </button>
      );
    }
    return (
      <span className="flex items-center justify-center gap-1 px-4 py-2 text-gray-500 font-semibold">
        <BadgeCheck className="h-5 w-5" /> Đã xử lý
      </span>
    );
  };

  // Thống kê
  const waitingCount = orders.filter(o => o.status === 'Đang chờ nhận').length;
  const receivedCount = orders.filter(o => o.status === 'Đã nhận').length;
  const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 text-lg font-semibold animate-fade-in-down ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
          {toast.message}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <ListChecks className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800">Nhận Hàng</h1>
            </div>
            <p className="text-gray-600 text-base">Xác nhận các phiếu xuất hàng đã được giao đến.</p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-400 flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full"><PackageOpen className="h-7 w-7 text-yellow-600" /></div>
                <div>
                    <h3 className="text-gray-500 font-semibold">Phiếu chờ nhận</h3>
                    <p className="text-3xl font-bold text-gray-800">{waitingCount}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full"><BadgeCheck className="h-7 w-7 text-green-600" /></div>
                <div>
                    <h3 className="text-gray-500 font-semibold">Phiếu đã nhận</h3>
                    <p className="text-3xl font-bold text-gray-800">{receivedCount}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full"><ShoppingCart className="h-7 w-7 text-blue-600" /></div>
                <div>
                    <h3 className="text-gray-500 font-semibold">Tổng giá trị chờ</h3>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(orders.filter(o => o.status === 'Đang chờ nhận').reduce((s, c) => s + c.totalAmount, 0))}</p>
                </div>
            </div>
        </div>

        {/* Table */}
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
                  <th className="py-4 px-4 text-center font-semibold text-gray-600 text-sm tracking-wider uppercase"><span className="flex items-center gap-2 justify-center"><Users className="h-5 w-5" />Trạng thái</span></th>
                  <th className="py-4 px-4 text-center font-semibold text-gray-600 text-sm tracking-wider uppercase"><span className="flex items-center gap-2 justify-center"><MoreVertical className="h-5 w-5" />Thao tác</span></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-4 font-bold text-blue-700 whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{order.exportDate}</td>
                    <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
                        <div className="font-semibold">{order.agency.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1"><Phone size={14}/> {order.agency.contact}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            {product.name} <span className="text-gray-500 font-medium">({product.quantity} {product.unit})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="w-28 mx-auto">
                        {getActionButton(order)}
                      </div>
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
