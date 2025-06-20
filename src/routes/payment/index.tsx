import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PaymentRecord {
  id: string;
  agency: string;
  address: string;
  phone: string;
  email: string;
  paymentDate: string;
  amount: number;
}

// Component cho hàng trong bảng
const PaymentRow: React.FC<{
  record: PaymentRecord;
  onDelete: (record: PaymentRecord) => void;
}> = ({ record, onDelete }) => {
  const statusColors = {
    'Hoàn thành': 'bg-green-100 text-green-800',
    'Đang xử lý': 'bg-yellow-100 text-yellow-800',
    'Hủy': 'bg-red-100 text-red-800'
  };

  return (
    <tr className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
      <td className="py-3 px-4 font-semibold text-blue-700">{record.id}</td>
      <td className="py-3 px-4">
        <div>
          <div className="font-semibold text-gray-900">{record.agency}</div>
          <div className="text-sm text-gray-500">{record.address}</div>
        </div>
      </td>
      <td className="py-3 px-4 font-bold text-green-600">
        {record.amount.toLocaleString('vi-VN')} VNĐ
      </td>
      <td className="py-3 px-4 hidden lg:table-cell">{record.paymentDate}</td>
      <td className="py-3 px-4 hidden md:table-cell">{record.phone}</td>
      <td className="py-3 px-4 hidden xl:table-cell">{record.email}</td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Link
            to={`/payment/detail/${record.id}`}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Chi tiết
          </Link>
          <button
            onClick={() => onDelete(record)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
};

// Component cho modal xác nhận xóa
const DeleteModal: React.FC<{
  record: PaymentRecord | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ record, onConfirm, onCancel }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
          <p className="text-gray-600 mb-6">
            Xóa phiếu thu <strong>{record.id}</strong>?
            <br />
            <span className="text-sm text-red-600">Không thể hoàn tác.</span>
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold">
              Hủy
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PaymentRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Hiển thị 5 phiếu thu mỗi trang

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([
    {
      id: 'PT001',
      agency: 'Đại lý Hà Nội',
      address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      phone: '0901234567',
      email: 'hanoi@example.com',
      paymentDate: '2024-01-15',
      amount: 5000000,
    },
    {
      id: 'PT002',
      agency: 'Đại lý Hồ Chí Minh',
      address: '456 Lê Lợi, Q.1, TP.HCM',
      phone: '0902345678',
      email: 'hcm@example.com',
      paymentDate: '2024-01-14',
      amount: 3500000,
    },
  ]);

  const filteredRecords = paymentRecords.filter(record =>
    record.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.phone.includes(searchTerm) ||
    record.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Tính toán phân trang
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  
  // Xử lý chuyển trang
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (record: PaymentRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (recordToDelete) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from local state
        setPaymentRecords(paymentRecords.filter(r => r.id !== recordToDelete.id));
        
        // Close modal and reset
        setShowDeleteModal(false);
        setRecordToDelete(null);
        
        alert(`Đã xóa phiếu thu ${recordToDelete.id} thành công!`);
      } catch (error) {
        console.error('Error deleting payment record:', error);
        alert('Có lỗi xảy ra khi xóa phiếu thu!');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-100 text-green-800';
      case 'Đang xử lý': return 'bg-yellow-100 text-yellow-800';
      case 'Hủy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">
        QUẢN LÝ THANH TOÁN
      </h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
        <input
          type="text"
          placeholder="Tìm kiếm phiếu thu..."
          className="flex-1 min-w-[220px] px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <Link
          to="/payment/add"
          className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Thêm phiếu thu</span>
          <span className="sm:hidden">Thêm</span>
        </Link> */}
      </div>

      <h2 className="text-2xl font-extrabold text-blue-800 mb-6 drop-shadow">Danh sách phiếu thu</h2>
      
      {/* Payment Records Table - Simplified */}
      <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
        <table className="min-w-full bg-white border border-blue-200">
          <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
            <tr className="uppercase text-sm">
              <th className="py-3 px-4 text-left whitespace-nowrap">Đại lý</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Địa chỉ</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Điện thoại</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Email</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Ngày thu tiền</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Số tiền thu</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {currentRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-blue-700">{record.agency}</td>
                <td className="px-4 py-3 text-gray-800">{record.address}</td>
                <td className="px-4 py-3 text-gray-800">{record.phone}</td>
                <td className="px-4 py-3 text-gray-800">{record.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{record.paymentDate}</td>
                <td className="px-4 py-3 font-bold text-green-600">{record.amount.toLocaleString('vi-VN')} VND</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/payment/detail/${record.id}`}
                      className="p-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(record)}
                      className="p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-colors"
                      title="Xóa phiếu thu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Không tìm thấy phiếu thu nào.</p>
        </div>
      )}

      {/* Pagination */}
      {filteredRecords.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-lg shadow-sm">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-l-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              &laquo;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border border-gray-300 ${
                  currentPage === index + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-r-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa phiếu thu</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa phiếu thu <strong>{recordToDelete?.id}</strong>?
                <br />
                <span className="text-sm text-red-600">Hành động này không thể hoàn tác.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Xóa phiếu thu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;