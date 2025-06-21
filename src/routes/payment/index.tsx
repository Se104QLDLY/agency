import React, { useState, useMemo } from 'react';
import { Receipt, Trash2, Eye, AlertCircle, CheckCircle, Users, Mail, Phone, MapPin, CalendarDays, DollarSign, Search, MoreVertical, Edit3, ListChecks, LayoutGrid, List } from 'lucide-react';

// Interface cho một bản ghi thanh toán
interface PaymentRecord {
  id: string;
  agency: string;
  address: string;
  phone: string;
  email: string;
  paymentDate: string;
  amount: number;
}

// ---- Dữ liệu mẫu ----
const initialPaymentRecords: PaymentRecord[] = [
    { id: 'PT001', agency: 'Đại lý Miền Bắc', address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội', phone: '0901234567', email: 'mienbac@example.com', paymentDate: '2024-07-21', amount: 5000000, },
    { id: 'PT002', agency: 'Đại lý Miền Trung', address: '123 Lê Lợi, Hải Châu, Đà Nẵng', phone: '0902345678', email: 'mientrung@example.com', paymentDate: '2024-07-20', amount: 3500000, },
    { id: 'PT003', agency: 'Đại lý Miền Nam', address: '25 Nguyễn Huệ, Quận 1, TP.HCM', phone: '0903456789', email: 'miennam@example.com', paymentDate: '2024-07-19', amount: 8750000, },
    { id: 'PT004', agency: 'Đại lý Tây Nguyên', address: '50 Hùng Vương, Buôn Ma Thuột, Đắk Lắk', phone: '0904567890', email: 'taynguyen@example.com', paymentDate: '2024-07-18', amount: 4200000, },
    { id: 'PT005', agency: 'Đại lý Đồng Bằng Sông Cửu Long', address: '10 Nguyễn Trãi, Ninh Kiều, Cần Thơ', phone: '0905678901', email: 'dbscl@example.com', paymentDate: '2024-07-17', amount: 6800000, },
    { id: 'PT006', agency: 'Đại lý Duyên Hải Nam Trung Bộ', address: '30 Trần Phú, Nha Trang, Khánh Hòa', phone: '0906789012', email: 'dhntb@example.com', paymentDate: '2024-07-16', amount: 3100000, },
];

// Component cho card phiếu thu (mobile view) - Giữ nguyên code gốc của bạn
const PaymentCard: React.FC<{
  record: PaymentRecord;
  onDelete: (record: PaymentRecord) => void;
  onViewDetail: (record: PaymentRecord) => void;
}> = ({ record, onDelete, onViewDetail }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold text-blue-700 text-sm">{record.id}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onViewDetail(record)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          <button 
            onClick={() => onDelete(record)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa phiếu thu"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">{record.agency}</span>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <span className="text-sm text-gray-600">{record.address}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            <span>{record.paymentDate}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{record.email}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Số tiền thu:</span>
            <span className="font-bold text-green-600 text-lg">
              {record.amount.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component cho modal chi tiết phiếu thu - Giữ nguyên code gốc của bạn
const DetailModal: React.FC<{
  record: PaymentRecord | null;
  onClose: () => void;
}> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Chi tiết phiếu thu</h2>
                <p className="text-blue-100">Mã phiếu: {record.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Thông tin đại lý
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm text-gray-500">Tên đại lý</label><p className="font-medium text-gray-900">{record.agency}</p></div>
              <div><label className="text-sm text-gray-500">Mã phiếu thu</label><p className="font-medium text-blue-600">{record.id}</p></div>
            </div>
            <div className="mt-3"><label className="text-sm text-gray-500">Địa chỉ</label><p className="font-medium text-gray-900">{record.address}</p></div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Phone className="w-5 h-5 text-green-600" />Thông tin liên hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><div><label className="text-sm text-gray-500">Số điện thoại</label><p className="font-medium text-gray-900">{record.phone}</p></div></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><div><label className="text-sm text-gray-500">Email</label><p className="font-medium text-gray-900">{record.email}</p></div></div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
             <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600" />Thông tin thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gray-400" /><div><label className="text-sm text-gray-500">Ngày thu tiền</label><p className="font-medium text-gray-900">{record.paymentDate}</p></div></div>
              <div><label className="text-sm text-gray-500">Số tiền thu</label><p className="text-2xl font-bold text-green-600">{record.amount.toLocaleString('vi-VN')} VNĐ</p></div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-600" />Trạng thái</h3>
            <div className="flex items-center gap-2"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Hoàn thành</span><span className="text-sm text-gray-500">Phiếu thu đã được xử lý thành công</span></div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Đóng</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"><Edit3 className="w-4 h-4" />Chỉnh sửa</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component cho modal xác nhận xóa - Giữ nguyên code gốc của bạn
const DeleteModal: React.FC<{
  record: PaymentRecord | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ record, onConfirm, onCancel }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa phiếu thu</h3>
          <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa phiếu thu <strong>{record.id}</strong>?<br /><span className="text-sm text-red-600">Hành động này không thể hoàn tác.</span></p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold">Hủy bỏ</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">Xóa phiếu thu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component chính
const PaymentPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<PaymentRecord | null>(null);
    const [recordToView, setRecordToView] = useState<PaymentRecord | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
    const itemsPerPage = 8;
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(initialPaymentRecords);

    // Logic xử lý - Giữ nguyên code gốc của bạn
    const filteredRecords = paymentRecords.filter(record =>
        record.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.phone.includes(searchTerm) ||
        record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };

    const handleDeleteClick = (record: PaymentRecord) => {
      setRecordToDelete(record);
      setShowDeleteModal(true);
    };

    const handleViewDetail = (record: PaymentRecord) => {
      setRecordToView(record);
      setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
      setShowDetailModal(false);
      setRecordToView(null);
    };

    const handleDeleteConfirm = async () => {
      if (recordToDelete) {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setPaymentRecords(paymentRecords.filter(r => r.id !== recordToDelete.id));
          setShowDeleteModal(false);
          setRecordToDelete(null);
          setToast({ type: 'success', message: `Đã xóa phiếu thu ${recordToDelete.id} thành công!` });
          setTimeout(() => setToast(null), 3000);
        } catch (error) {
          setToast({ type: 'error', message: 'Có lỗi xảy ra khi xóa phiếu thu!' });
          setTimeout(() => setToast(null), 3000);
        }
      }
    };

    const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setRecordToDelete(null);
    };

    const totalPayments = paymentRecords.length;
    const totalAmount = paymentRecords.reduce((sum, r) => sum + r.amount, 0);
    const uniqueAgencies = [...new Set(paymentRecords.map(r => r.agency))].length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 font-semibold animate-fade-in-down ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {toast.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                    {toast.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* ---- HEADER ĐÃ ĐƯỢC CẬP NHẬT ---- */}
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Receipt className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-800">Quản Lý Thanh Toán</h1>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-1 ml-1">Theo dõi và quản lý các phiếu thu từ đại lý.</p>
                </header>

                {/* ---- THẺ THỐNG KÊ ĐÃ ĐƯỢC CẬP NHẬT ---- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 flex items-center gap-5">
                        <div className="bg-blue-100 p-3 rounded-full"><ListChecks className="h-7 w-7 text-blue-600" /></div>
                        <div>
                            <h3 className="text-gray-500 font-semibold">Tổng phiếu thu</h3>
                            <p className="text-3xl font-bold text-gray-800">{totalPayments}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 flex items-center gap-5">
                        <div className="bg-green-100 p-3 rounded-full"><DollarSign className="h-7 w-7 text-green-600" /></div>
                        <div>
                            <h3 className="text-gray-500 font-semibold">Tổng số tiền</h3>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-800">{(totalAmount / 1000000).toFixed(2)}M</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500 flex items-center gap-5">
                        <div className="bg-purple-100 p-3 rounded-full"><Users className="h-7 w-7 text-purple-600" /></div>
                        <div>
                            <h3 className="text-gray-500 font-semibold">Số đại lý</h3>
                            <p className="text-3xl font-bold text-gray-800">{uniqueAgencies}</p>
                        </div>
                    </div>
                </div>

                {/* ---- PHẦN CÒN LẠI GIỮ NGUYÊN CODE GỐC CỦA BẠN ---- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm phiếu thu, đại lý..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {viewMode === 'table' ? <LayoutGrid size={16}/> : <List size={16}/>}
                                {viewMode === 'table' ? 'Card View' : 'Table View'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {viewMode === 'table' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1"><ListChecks className="h-5 w-5" />Mã phiếu</span></th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1"><Users className="h-5 w-5" />Thông tin đại lý</span></th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm hidden lg:table-cell"><span className="flex items-center gap-1"><Phone className="h-5 w-5" />Liên hệ</span></th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1"><CalendarDays className="h-5 w-5" />Ngày thu</span></th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1 justify-end"><DollarSign className="h-5 w-5" />Số tiền</span></th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1 justify-center"><MoreVertical className="h-5 w-5" />Thao tác</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Receipt className="w-4 h-4 text-blue-600" /></div><span className="font-semibold text-blue-700">{record.id}</span></div></td>
                                        <td className="py-3 px-4"><div><div className="font-medium text-gray-900">{record.agency}</div><div className="text-sm text-gray-500 truncate max-w-xs">{record.address}</div></div></td>
                                        <td className="py-3 px-4 hidden lg:table-cell"><div className="text-sm space-y-1"><div className="flex items-center gap-1 text-gray-600"><Phone className="w-3 h-3" /><span>{record.phone}</span></div><div className="flex items-center gap-1 text-gray-600"><Mail className="w-3 h-3" /><span className="truncate max-w-xs">{record.email}</span></div></div></td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{record.paymentDate}</td>
                                        <td className="py-3 px-4 text-right"><span className="font-bold text-green-600">{record.amount.toLocaleString('vi-VN')} VNĐ</span></td>
                                        <td className="py-3 px-4"><div className="flex items-center justify-center gap-1"><button onClick={() => handleViewDetail(record)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group" title="Xem chi tiết"><Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" /></button><button onClick={() => handleDeleteClick(record)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group" title="Xóa phiếu thu"><Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" /></button></div></td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {currentRecords.map((record) => (<PaymentCard key={record.id} record={record} onDelete={handleDeleteClick} onViewDetail={handleViewDetail} />))}
                            </div>
                        </div>
                    )}
                    {filteredRecords.length === 0 && (
                        <div className="text-center py-12"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-6 h-6 text-gray-400" /></div><p className="text-gray-500 text-lg">Không tìm thấy phiếu thu nào</p><p className="text-gray-400 text-sm">Thử thay đổi từ khóa tìm kiếm</p></div>
                    )}
                </div>

                {filteredRecords.length > itemsPerPage && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex items-center gap-1">
                            <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Trước</button>
                            {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                                if (pageNum > totalPages) return null;
                                return (<button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-3 py-2 text-sm border rounded-lg transition-colors ${ currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50' }`}>{pageNum}</button>);
                            })}
                            <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Sau</button>
                        </nav>
                    </div>
                )}
            </div>

            <DetailModal record={recordToView} onClose={handleCloseDetail} />
            <DeleteModal record={recordToDelete} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />
        </div>
    );
};

export default PaymentPage;
