import React, { useState } from 'react';

interface ProductItem {
  name: string;
  quantity: number;
  unit: string;
}

interface ExportOrder {
  id: string;
  exportDate: string;
  products: ProductItem[];
  totalAmount: number;
  status: 'Đang chờ nhận' | 'Đã nhận';
}

const ImportPage: React.FC = () => {
  const [orders, setOrders] = useState<ExportOrder[]>(
    [
      {
        id: 'PX001',
        exportDate: '2024-01-15',
        products: [
          { name: 'Sản phẩm A', quantity: 10, unit: 'thùng' },
          { name: 'Sản phẩm B', quantity: 5, unit: 'kg' }
        ],
        totalAmount: 18500000,
        status: 'Đang chờ nhận'
      },
      {
        id: 'PX002',
        exportDate: '2024-01-14',
        products: [
          { name: 'Sản phẩm C', quantity: 20, unit: 'chai' },
          { name: 'Sản phẩm D', quantity: 8, unit: 'hộp' }
        ],
        totalAmount: 25700000,
        status: 'Đang chờ nhận'
      },
      {
        id: 'PX003',
        exportDate: '2024-01-13',
        products: [
          { name: 'Sản phẩm E', quantity: 15, unit: 'gói' }
        ],
        totalAmount: 12300000,
        status: 'Đã nhận'
      }
    ]
  );

  const handleReceiveOrder = async (orderId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'Đã nhận' as const }
            : order
        )
      );
      
      alert(`Đã nhận hàng cho phiếu ${orderId} thành công!`);
    } catch (error) {
      console.error('Error receiving order:', error);
      alert('Có lỗi xảy ra khi nhận hàng!');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'VND';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Đang chờ nhận') {
      return (
        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-lg">
          Đang chờ nhận
        </span>
      );
    } else {
      return (
        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
          Đã nhận
        </span>
      );
    }
  };

  const getActionButton = (order: ExportOrder) => {
    if (order.status === 'Đang chờ nhận') {
      return (
        <button
          onClick={() => handleReceiveOrder(order.id)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nhận hàng
        </button>
      );
    } else {
      return (
        <span className="px-4 py-2 text-gray-500 font-semibold">
          Đã xử lý
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
          NHẬN HÀNG
        </h1>
        <p className="text-gray-600 text-lg">
          Danh sách phiếu xuất đang chờ nhận và đã nhận.
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="border-b border-blue-100">
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Mã phiếu</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Ngày xuất</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Danh sách sản phẩm</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className={index < orders.length - 1 ? "border-b border-blue-50" : ""}>
                  <td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">{order.id}</td>
                  <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{order.exportDate}</td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="text-gray-700">
                          {product.name} <span className="text-gray-500 ml-8">{product.quantity} {product.unit}</span>
                        </div>
                      ))}
                      <div className="text-blue-800 font-bold mt-2">
                        Tổng: {formatCurrency(order.totalAmount)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-4">
                    {getActionButton(order)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Không có phiếu xuất nào đang chờ nhận.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;