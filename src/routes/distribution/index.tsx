import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ProductLine {
  productId: string;
  quantity: number;
  unit: string;
}

interface DistributionFormData {
  products: ProductLine[];
  deliveryAddress: string;
}

interface DistributionRequest extends DistributionFormData {
  id: string;
  submittedAt: string;
  lastUpdatedAt: string;
  status: 'processing' | 'postponed' | 'confirmed';
  statusReason?: string;
  forcePostponed: boolean;
}

const unitOptions = ['Thùng', 'Hộp', 'Chai', 'Gói', 'Kg', 'Lít', 'Cái'];

const schema = yup.object({
  products: yup.array().of(
    yup.object({
      productId: yup.string().required('Chọn sản phẩm'),
      quantity: yup.number().required('Nhập số lượng').min(1, 'Số lượng > 0'),
      unit: yup.string().required('Chọn đơn vị'),
    })
  ).min(1, 'Chọn ít nhất 1 sản phẩm'),
  deliveryAddress: yup.string().required('Nhập địa chỉ').min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
});

// Mock product list
const productsList = [
  { id: 'sp001', name: 'Sản phẩm A' },
  { id: 'sp002', name: 'Sản phẩm B' },
  { id: 'sp003', name: 'Sản phẩm C' },
  { id: 'sp004', name: 'Sản phẩm D' },
];

const DistributionRequestPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<DistributionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DistributionRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [forcePostponed, setForcePostponed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DistributionFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      products: [{ productId: '', quantity: 1, unit: '' }],
      deliveryAddress: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'products' });

  // Simulate staff processing in the background
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prevRequests => {
        const newRequests = [...prevRequests];

        // Find the first request that is 'processing' or 'postponed'
        const requestToProcessIndex = newRequests.findIndex(r => r.status === 'processing' || (r.status === 'postponed' && Math.random() < 0.2)); // 20% chance to re-process a postponed one

        if (requestToProcessIndex !== -1) {
          const originalRequest = newRequests[requestToProcessIndex];

          // Null check to satisfy linter
          if (!originalRequest) return prevRequests;

          let newStatus: DistributionRequest['status'] = originalRequest.status;
          let newStatusReason = originalRequest.statusReason;
          
          if (originalRequest.status === 'processing') {
            // Use the force toggle if it's on, otherwise use random logic
            const isPostponed = originalRequest.forcePostponed || Math.random() < 0.3;

            if (isPostponed) {
              newStatus = 'postponed';
              newStatusReason = 'Tạm hoãn do không đủ hàng tồn kho. Vui lòng đợi.';
            } else {
              newStatus = 'confirmed';
              newStatusReason = 'Đơn hàng đã được xác nhận và đang chuẩn bị giao.';
            }
          } else if (originalRequest.status === 'postponed') {
            // Do not force postponed on an already postponed order that is being re-processed
            newStatus = 'confirmed';
            newStatusReason = 'Đơn hàng tạm hoãn đã được xác nhận sau khi nhập kho.';
          }
          
          newRequests[requestToProcessIndex] = {
            ...originalRequest,
            id: originalRequest.id,
            submittedAt: originalRequest.submittedAt,
            products: originalRequest.products,
            deliveryAddress: originalRequest.deliveryAddress,
            status: newStatus,
            statusReason: newStatusReason,
            lastUpdatedAt: new Date().toISOString(),
            forcePostponed: false, // Flag is used, so we reset it
          };
          return newRequests;
        }
        
        return prevRequests;
      });
    }, 5000); // Check for updates every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const addProductLine = () => append({ productId: '', quantity: 1, unit: '' });
  const removeProductLine = (idx: number) => remove(idx);

  const getProductName = (productId: string) => productsList.find(p => p.id === productId)?.name || 'Sản phẩm không xác định';

  const onSubmit = async (data: DistributionFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRequest: DistributionRequest = {
      id: 'DH' + Date.now().toString().slice(-8),
      products: data.products,
      deliveryAddress: data.deliveryAddress,
      submittedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      status: 'processing',
      statusReason: 'Yêu cầu của bạn đã được tiếp nhận và đang chờ xử lý.',
      forcePostponed: forcePostponed,
    };
    
    setRequests(prev => [newRequest, ...prev]);
    reset();
    setIsSubmitting(false);
    setForcePostponed(false);
  };

  const handleViewDetails = (request: DistributionRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedRequest(null);
  };

  const getStatusInfo = (status: DistributionRequest['status']) => {
    switch (status) {
      case 'processing': return { text: 'Đang xử lý', color: 'blue', icon: '⏳' };
      case 'postponed': return { text: 'Tạm hoãn', color: 'orange', icon: '⏸️' };
      case 'confirmed': return { text: 'Đã xác nhận', color: 'green', icon: '✅' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 mt-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7a4 4 0 014-4h8a4 4 0 014 4v7c0 2.21-3.582 4-8 4z" /></svg>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide">Gửi yêu cầu phân phối</h1>
          <div className="text-blue-500 font-semibold">Điền thông tin để gửi yêu cầu phân phối sản phẩm đến kho của bạn</div>
        </div>
      </div>

      {/* Order History Section */}
      {requests.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 shadow-md">
          <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lịch sử đơn hàng
          </h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {requests.map((request) => {
              const statusInfo = getStatusInfo(request.status);
              return (
                <div 
                  key={request.id} 
                  onClick={() => handleViewDetails(request)} 
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-indigo-700">{request.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        statusInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(request.submittedAt).toLocaleString('vi-VN')}</span>
                  </div>

                  <div className="mt-2 pl-1">
                    <p className="text-sm text-gray-700 truncate">
                      {request.products.length} sản phẩm • {request.deliveryAddress}
                    </p>

                    {request.status === 'postponed' && request.statusReason && (
                      <p className="mt-2 text-xs text-orange-800 bg-orange-50 border border-orange-200 rounded-md p-2">
                        <span className="font-bold">Lý do:</span> {request.statusReason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Lines */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 shadow-md">
          <label className="block text-blue-700 font-semibold mb-4">Danh sách sản phẩm <span className="text-red-500">*</span></label>
          <div className="space-y-4">
            {fields.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="md:col-span-5">
                  <label className="block text-blue-700 font-semibold mb-1">Sản phẩm</label>
                  <select {...register(`products.${idx}.productId` as const)} className="w-full px-3 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg">
                    <option value="">Chọn sản phẩm...</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.products && Array.isArray(errors.products) && errors.products[idx]?.productId && <span className="text-red-500 text-xs">{(errors.products[idx] as any)?.productId?.message}</span>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-blue-700 font-semibold mb-1">Số lượng</label>
                  <input type="number" min={1} {...register(`products.${idx}.quantity` as const)} className="w-full px-3 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" />
                  {errors.products && Array.isArray(errors.products) && errors.products[idx]?.quantity && <span className="text-red-500 text-xs">{(errors.products[idx] as any)?.quantity?.message}</span>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-blue-700 font-semibold mb-1">Đơn vị tính</label>
                  <select {...register(`products.${idx}.unit` as const)} className="w-full px-3 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg">
                    <option value="">Chọn đơn vị</option>
                    {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                  {errors.products && Array.isArray(errors.products) && errors.products[idx]?.unit && <span className="text-red-500 text-xs">{(errors.products[idx] as any)?.unit?.message}</span>}
                </div>
                <div className="md:col-span-1 flex justify-end">
                  {(fields.length > 1 && idx !== fields.length - 1) && (
                    <button type="button" onClick={() => removeProductLine(idx)} className="text-red-600 hover:text-red-800 px-2 py-1 rounded-full bg-red-50"><svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 20 20' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg></button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addProductLine} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"><svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 inline-block mr-1' fill='none' viewBox='0 0 20 20' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 5v10m5-5H5' /></svg>Thêm sản phẩm</button>
        </div>
        {/* Delivery Address */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 shadow-md">
          <label className="block text-green-700 font-semibold mb-2">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
          <textarea {...register('deliveryAddress')} rows={4} className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg shadow-sm resize-none" />
          {errors.deliveryAddress && <span className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</span>}
          <p className="text-gray-500 text-sm mt-1">Địa chỉ cần chi tiết để giúp việc giao hàng được nhanh chóng và chính xác hơn</p>
        </div>
        {/* Test Tool */}
        <div className="flex items-center justify-end gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <label htmlFor="forcePostponed" className="font-semibold text-sm text-yellow-800">
            Công cụ Test:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="forcePostponed"
              checked={forcePostponed}
              onChange={(e) => setForcePostponed(e.target.checked)}
              className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
            />
            <label htmlFor="forcePostponed" className="text-sm text-gray-700">Buộc trạng thái "Tạm hoãn" cho yêu cầu tiếp theo</label>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
            {isSubmitting && <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>}
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
          <button type="button" onClick={() => reset()} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all text-lg">Làm mới</button>
        </div>
      </form>

      {/* Order Status Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="text-center mb-6">
              {(() => {
                const statusInfo = getStatusInfo(selectedRequest.status);
                return (
                  <>
                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                      selectedRequest.status === 'confirmed' ? 'bg-green-100' : selectedRequest.status === 'postponed' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <span className={`text-3xl ${selectedRequest.status === 'confirmed' ? 'text-green-600' : selectedRequest.status === 'postponed' ? 'text-orange-600' : 'text-blue-600'}`}>
                        {statusInfo.icon}
                      </span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${
                      selectedRequest.status === 'confirmed' ? 'text-green-700' : selectedRequest.status === 'postponed' ? 'text-orange-700' : 'text-blue-700'
                    }`}>
                      {statusInfo.text}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {selectedRequest.statusReason}
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Chi tiết đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold">{selectedRequest.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian gửi:</span>
                  <span>{new Date(selectedRequest.submittedAt).toLocaleString('vi-VN')}</span>
                </div>
                {(selectedRequest.status === 'confirmed' || selectedRequest.status === 'postponed') && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cập nhật lần cuối:</span>
                    <span>{new Date(selectedRequest.lastUpdatedAt).toLocaleString('vi-VN')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Sản phẩm đã yêu cầu</h3>
              <div className="space-y-2">
                {selectedRequest.products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                    <span className="font-medium">{getProductName(product.productId)}</span>
                    <span className="text-gray-600">{product.quantity} {product.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Địa chỉ giao hàng</h3>
              <p className="text-gray-700">{selectedRequest.deliveryAddress}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Important Information */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400 shadow flex items-start gap-4">
        <div className="bg-blue-200 p-2 rounded-full mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <h3 className="text-blue-800 font-bold mb-2">Lưu ý quan trọng</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Yêu cầu sẽ được xử lý trong vòng 24-48 giờ làm việc</li>
            <li>• Số lượng yêu cầu không được vượt quá hạn mức cho phép của từng sản phẩm</li>
            <li>• Địa chỉ giao hàng phải chính xác để tránh chậm trễ trong quá trình vận chuyển</li>
            <li>• Trạng thái đơn hàng sẽ được tự động cập nhật trong danh sách bên dưới.</li>
            <li>• Nếu yêu cầu bị tạm hoãn, vui lòng chờ nhân viên xử lý, không cần gửi lại.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DistributionRequestPage;