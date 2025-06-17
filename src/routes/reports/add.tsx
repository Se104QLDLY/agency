import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface ReportFormData {
  type: 'Doanh số' | 'Công nợ';
  reportDate: string;
  period: string;
  description: string;
  amount: number;
  details: string;
}

const schema = yup.object({
  type: yup.string().required('Vui lòng chọn loại báo cáo'),
  reportDate: yup.string().required('Vui lòng chọn ngày báo cáo'),
  period: yup.string().required('Vui lòng chọn kỳ báo cáo'),
  description: yup.string().required('Vui lòng nhập mô tả báo cáo').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  amount: yup.number().required('Vui lòng nhập số tiền').min(0, 'Số tiền phải lớn hơn hoặc bằng 0'),
  details: yup.string().required('Vui lòng nhập chi tiết báo cáo').min(20, 'Chi tiết phải có ít nhất 20 ký tự'),
});

const AddReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: yupResolver(schema),
  });

  const reportTypes = [
    { value: 'Doanh số', label: 'Báo cáo doanh số' },
    { value: 'Công nợ', label: 'Báo cáo công nợ' },
  ];

  const reportPeriods = [
    { value: 'daily', label: 'Hàng ngày' },
    { value: 'weekly', label: 'Hàng tuần' },
    { value: 'monthly', label: 'Hàng tháng' },
    { value: 'quarterly', label: 'Hàng quý' },
    { value: 'yearly', label: 'Hàng năm' },
  ];

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Report data:', data);
      
      alert('Báo cáo đã được tạo thành công!');
      navigate('/search'); // Quay về trang danh sách báo cáo
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Có lỗi xảy ra khi tạo báo cáo!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              LẬP BÁO CÁO MỚI
            </h1>
            <Link
              to="/search"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại danh sách
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Thông tin báo cáo
            </h2>
            <p className="text-gray-600">
              Điền đầy đủ thông tin để tạo báo cáo mới
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Loại báo cáo <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn loại báo cáo</option>
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="text-red-500 text-sm mt-1">{errors.type.message}</span>
                )}
              </div>

              {/* Report Date */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Ngày báo cáo <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('reportDate')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.reportDate && (
                  <span className="text-red-500 text-sm mt-1">{errors.reportDate.message}</span>
                )}
              </div>

              {/* Report Period */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Kỳ báo cáo <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('period')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn kỳ báo cáo</option>
                  {reportPeriods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
                {errors.period && (
                  <span className="text-red-500 text-sm mt-1">{errors.period.message}</span>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Số tiền (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('amount')}
                  placeholder="Nhập số tiền"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.amount && (
                  <span className="text-red-500 text-sm mt-1">{errors.amount.message}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Mô tả báo cáo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('description')}
                placeholder="Nhập mô tả ngắn gọn về báo cáo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Chi tiết báo cáo <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('details')}
                rows={6}
                placeholder="Nhập chi tiết đầy đủ về nội dung báo cáo, bao gồm các số liệu, phân tích và nhận xét..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              {errors.details && (
                <span className="text-red-500 text-sm mt-1">{errors.details.message}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Đang tạo báo cáo...
                  </div>
                ) : (
                  'Tạo báo cáo'
                )}
              </button>
              <Link
                to="/search"
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg shadow-lg hover:bg-gray-200 transition-all text-lg text-center"
              >
                Hủy bỏ
              </Link>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-blue-800 font-bold mb-2">Hướng dẫn lập báo cáo</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Chọn loại báo cáo phù hợp với nội dung cần báo cáo</li>
                  <li>• Ngày báo cáo nên là ngày hiện tại hoặc ngày gần nhất</li>
                  <li>• Kỳ báo cáo giúp phân loại và quản lý báo cáo theo thời gian</li>
                  <li>• Số tiền phải chính xác và được kiểm tra kỹ trước khi nhập</li>
                  <li>• Mô tả và chi tiết càng rõ ràng càng tốt để dễ theo dõi và xử lý</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddReportPage; 