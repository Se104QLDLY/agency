import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface DistributionRequestData {
  product: string;
  quantity: number;
  deliveryAddress: string;
}

const schema = yup.object({
  product: yup.string().required('Vui lòng chọn sản phẩm'),
  quantity: yup
    .number()
    .required('Vui lòng nhập số lượng')
    .min(1, 'Số lượng phải lớn hơn 0')
    .integer('Số lượng phải là số nguyên'),
  deliveryAddress: yup
    .string()
    .required('Vui lòng nhập địa chỉ giao hàng')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
});

const DistributionRequestPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistributionRequestData>({
    resolver: yupResolver(schema),
  });

  // Mock products data
  const products = [
    { id: 'sp001', name: 'Sản phẩm A' },
    { id: 'sp002', name: 'Sản phẩm B' },
    { id: 'sp003', name: 'Sản phẩm C' },
    { id: 'sp004', name: 'Sản phẩm D' },
  ];

  const onSubmit = async (data: DistributionRequestData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Distribution request data:', data);
      
      alert('Yêu cầu phân phối đã được gửi thành công!');
      reset(); // Clear form after successful submission
    } catch (error) {
      console.error('Error submitting distribution request:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
            Gửi yêu cầu phân phối
          </h1>
          <p className="text-gray-600">
            Điền thông tin để gửi yêu cầu phân phối sản phẩm đến kho của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                Sản phẩm <span className="text-red-500">*</span>
              </label>
              <select
                {...register('product')}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              >
                <option value="">Chọn sản phẩm...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.product && (
                <span className="text-red-500 text-sm mt-1">{errors.product.message}</span>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('quantity')}
                placeholder="Nhập số lượng sản phẩm"
                min="1"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
              {errors.quantity && (
                <span className="text-red-500 text-sm mt-1">{errors.quantity.message}</span>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Số lượng phải nằm trong hạn mức cho phép của từng sản phẩm
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Địa chỉ giao hàng <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('deliveryAddress')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm resize-none"
            />
            {errors.deliveryAddress && (
              <span className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</span>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Địa chỉ cần chi tiết để giúp việc giao hàng được nhanh chóng và chính xác hơn
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Đang gửi...
                </div>
              ) : (
                'Gửi yêu cầu'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all text-lg"
            >
              Làm mới
            </button>
          </div>
        </form>

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-blue-800 font-bold mb-2">Lưu ý quan trọng</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Yêu cầu sẽ được xử lý trong vòng 24-48 giờ làm việc</li>
                <li>• Số lượng yêu cầu không được vượt quá hạn mức cho phép của từng sản phẩm</li>
                <li>• Địa chỉ giao hàng phải chính xác để tránh chậm trễ trong quá trình vận chuyển</li>
                <li>• Bạn sẽ nhận được thông báo qua email khi yêu cầu được phê duyệt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistributionRequestPage; 