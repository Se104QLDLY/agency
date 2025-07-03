import React, { useState, useMemo, useEffect } from 'react';
import { Receipt, Trash2, Eye, AlertCircle, CheckCircle, Users, Mail, Phone, MapPin, CalendarDays, DollarSign, Search, MoreVertical, Edit3, ListChecks, LayoutGrid, List, XCircle, Clock, Loader2, FilePlus2, Send, Building } from 'lucide-react';
import { getPayments, createPayment } from '../../api/payment.api';
import { getAgencies, type PaginatedAgencies } from '../../api/agency.api';
import { getAgencyForUser } from '../../api/staff.api';
import { useAuth } from '../../hooks/useAuth';
import type { Payment, PaymentPayload } from '../../types/payment.types';
import type { Agency } from '../../types/agency.types';

// Component cho modal "Lập phiếu thu"
const CreatePaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  onSuccess: () => void;
  user: ReturnType<typeof useAuth>['user']; // Accept user object as a prop
}> = ({ isOpen, onClose, agencies, onSuccess, user }) => {
  const [formData, setFormData] = useState<Partial<PaymentPayload>>({
    payment_date: new Date().toISOString().split('T')[0] // Mặc định ngày hôm nay
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAgencyDebt, setSelectedAgencyDebt] = useState<number | null>(null);

  // Auto-select agency for non-admin users
  useEffect(() => {
    if (isOpen && user && user.account_role !== 'admin' && user.agency_id) {
      const agentAgency = agencies.find(a => a.id === user.agency_id);
      if (agentAgency) {
        setFormData(prev => ({
          ...prev,
          agency_id: user.agency_id,
        }));
        setSelectedAgencyDebt(parseFloat(agentAgency.current_debt));
      }
    }
  }, [isOpen, user, agencies]);

  // Reset form state when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({ payment_date: new Date().toISOString().split('T')[0] });
      setSelectedAgencyDebt(null);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agencyId = Number(e.target.value);
    const selected = agencies.find(a => a.id === agencyId);
    if (selected) {
      setSelectedAgencyDebt(parseFloat(selected.current_debt));
      setFormData(prev => ({ ...prev, agency_id: agencyId, amount_collected: undefined })); // Reset amount on agency change
      setError(''); // Clear previous errors
    } else {
      setFormData(prev => ({ ...prev, agency_id: undefined, amount_collected: undefined }));
      setSelectedAgencyDebt(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // The field name from the input is 'amount', but our state uses 'amount_collected'
    const fieldName = name === 'amount' ? 'amount_collected' : name;

    if (fieldName === 'amount_collected') {
      const amount = Number(value);
       // Basic client-side validation for better UX
      if (selectedAgencyDebt !== null && amount > selectedAgencyDebt) {
        setError(`Số tiền thu không được vượt quá công nợ: ${selectedAgencyDebt.toLocaleString('vi-VN')} VNĐ`);
      } else if (amount < 0) {
        setError('Số tiền thu không được là số âm.');
      } else {
        setError(''); // Clear error if value is valid
      }
      setFormData(prev => ({ ...prev, [fieldName]: value ? amount : undefined }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, payment_date: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form data
    if (!formData.agency_id || formData.amount_collected === undefined || !formData.payment_date) {
      setError('Vui lòng điền đầy đủ thông tin: Đại lý, Số tiền thu, và Ngày thu tiền.');
      return;
    }
    
    if (formData.amount_collected <= 0) {
        setError('Số tiền thu phải là một số dương.');
        return;
    }

    if (selectedAgencyDebt !== null && formData.amount_collected > selectedAgencyDebt) {
        setError(`Số tiền thu không được vượt quá công nợ hiện tại.`);
        return;
    }

    setError('');
    setLoading(true);

    try {
      if (!formData.agency_id || !formData.amount_collected) {
        throw new Error("Thông tin không hợp lệ");
      }
      const payload: PaymentPayload = {
        agency_id: formData.agency_id,
        amount_collected: formData.amount_collected,
        payment_date: formData.payment_date,
      };

      await createPayment(payload);
      onSuccess(); // Callback to refresh data on parent component
      onClose(); // Close modal on success
    } catch (err: any) {
        // More robust error handling
        let errorMessage = 'Tạo phiếu thu thất bại. Vui lòng thử lại.';
        if (err.response && err.response.data) {
            const errorData = err.response.data;
            // Extract first error message from DRF's validation responses
            const keys = Object.keys(errorData);
            if (keys.length > 0) {
                // It can be an array of strings or a string
                const firstError = errorData[keys[0]!];
                if (Array.isArray(firstError)) {
                    errorMessage = firstError[0];
                } else {
                    errorMessage = String(firstError);
                }
            }
        }
        setError(errorMessage);
        console.error("Create payment error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FilePlus2/>Lập Phiếu Thu Tiền</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><XCircle className="w-6 h-6 text-gray-500"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="agency_id" className="block text-sm font-medium text-gray-700 mb-1">Chọn Đại Lý</label>
            <select
              id="agency_id"
              name="agency_id"
              onChange={handleAgencyChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              required
              value={formData.agency_id || ''}
              disabled={user?.account_role !== 'admin'} // Disable for non-admins
            >
              <option value="">-- Chọn một đại lý --</option>
              {agencies.map(agency => (
                <option key={agency.id} value={agency.id}>{agency.name} (ID: {agency.id})</option>
              ))}
            </select>
          </div>
          {selectedAgencyDebt !== null && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-r-lg">
              <p className="font-semibold">Công nợ hiện tại:</p>
              <p className="text-lg font-bold">{selectedAgencyDebt.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          )}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Số Tiền Thu (VNĐ)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount_collected || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập số tiền"
              required
              max={selectedAgencyDebt !== null ? selectedAgencyDebt : undefined}
              min="1"
            />
      </div>
          <div>
            <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700 mb-1">Ngày Thu Tiền</label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-md">{error}</p>}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:bg-blue-300"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Send className="w-5 h-5 mr-2" />}
              {loading ? 'Đang xử lý...' : 'Lập Phiếu Thu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<Payment[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('Quản lý Phiếu Thu Tiền');

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  
  const handleSuccess = () => {
    fetchAllData(); // Re-fetch all data on success
  };

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
        // Fetch agencies first, as they are needed for context.
        const agenciesResponse: PaginatedAgencies = await getAgencies();
        const agenciesList = agenciesResponse.results || [];
        setAgencies(agenciesList);

        let paymentsResponse;
        if (user.account_role === 'admin') {
            setTitle('Quản lý tất cả Phiếu Thu Tiền');
            paymentsResponse = await getPayments();
        } else {
            // For non-admins, first check if agency_id is directly on the user object (for agents)
            let agencyId: number | null = user.agency_id || null;

            // If not found, then try to fetch it via staff mapping (for staff)
            if (!agencyId) {
                agencyId = await getAgencyForUser(user.id);
            }

            if (agencyId) {
                paymentsResponse = await getPayments(agencyId);
                const agency = agenciesList.find((a: Agency) => a.id === agencyId);
                setTitle(agency ? `Phiếu Thu của ${agency.name}` : 'Phiếu Thu của Đại lý');
            } else {
                paymentsResponse = { results: [] }; // No agency assigned, show no payments
                setTitle('Không có dữ liệu phiếu thu');
            }
        }
        setRecords(paymentsResponse?.results || []);
    } catch (error) {
        console.error("Failed to fetch payment page data:", error);
        // Optionally set an error state to show in the UI
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllData();
  }, [user]);
  
  const totalCollected = useMemo(() => {
    return records.reduce((sum, record) => sum + parseFloat(record.amount_collected), 0);
  }, [records]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <CreatePaymentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        agencies={agencies}
        onSuccess={handleSuccess}
        user={user} // Pass user to the modal
      />
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
              <Receipt className="w-8 h-8 text-blue-600" />
              {title}
            </h1>
            <p className="text-gray-500 mt-1">Theo dõi và quản lý các khoản thu tiền từ đại lý.</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-colors"
          >
            <FilePlus2 className="w-5 h-5 mr-2" />
            Lập Phiếu Thu
          </button>
        </div>
        </div>
        
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng số phiếu thu</p>
                <p className="text-2xl font-bold text-blue-600">{records.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <List className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Tổng tiền đã thu</p>
                <p className="text-2xl font-bold text-green-600">{totalCollected.toLocaleString('vi-VN')} VNĐ</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Phiếu Thu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Đại Lý</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Thu</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền Thu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người Tạo</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {records.map((record) => (
                  <tr key={record.payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">PT{String(record.payment_id).padStart(5, '0')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.agency_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(record.payment_date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">{parseFloat(record.amount_collected).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentPage;