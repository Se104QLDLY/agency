import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ProductLine {
  productId: string;
  quantity: number;
  unit: string;
}

interface DistributionRequestData {
  products: ProductLine[];
  deliveryAddress: string;
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

const DistributionRequestPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productsList] = useState([
    { id: 'sp001', name: 'Sản phẩm A' },
    { id: 'sp002', name: 'Sản phẩm B' },
    { id: 'sp003', name: 'Sản phẩm C' },
    { id: 'sp004', name: 'Sản phẩm D' },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DistributionRequestData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      products: [{ productId: '', quantity: 1, unit: '' }],
      deliveryAddress: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'products' });

  const addProductLine = () => {
    append({ productId: '', quantity: 1, unit: '' });
  };
  const removeProductLine = (idx: number) => {
    remove(idx);
  };

  const onSubmit = async (data: DistributionRequestData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Distribution request data:', data);
      alert('Yêu cầu phân phối đã được gửi thành công!');
      reset();
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi yêu cầu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
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
        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
            {isSubmitting && <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>}
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
          <button type="button" onClick={handleReset} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all text-lg">Làm mới</button>
        </div>
      </form>
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
            <li>• Bạn sẽ nhận được thông báo qua email khi yêu cầu được phê duyệt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DistributionRequestPage;