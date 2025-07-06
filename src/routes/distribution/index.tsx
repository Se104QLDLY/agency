import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Truck, Plus, X, Send, RefreshCw, Calendar, User } from 'lucide-react';
import distributionApi, { type DistributionRequest as ApiDistributionRequest, type Product, type CreateDistributionRequest } from '../../api/distribution.api';
import { useAuth } from '../../hooks/useAuth';

interface ProductLine {
  productId: string;
  quantity: number;
  unit: string; // Will be auto-filled from selected product
}

interface DistributionFormData {
  products: ProductLine[];
  deliveryAddress: string;
}

// Frontend-specific request interface to maintain UI compatibility
interface DistributionRequest extends DistributionFormData {
  id: string;
  submittedAt: string;
  lastUpdatedAt: string;
  status: 'processing' | 'postponed' | 'confirmed' | 'cancelled';
  statusReason?: string;
  forcePostponed: boolean;
}

// Transform API response to frontend format
const transformApiToFrontend = (apiRequest: ApiDistributionRequest): DistributionRequest => ({
  id: `DH${String(apiRequest.issue_id).padStart(6, '0')}`,
  products: apiRequest.details?.map(detail => ({
    productId: String(detail.item),
    quantity: detail.quantity,
    unit: 'Cái' // Use default unit since API doesn't provide unit_name in details
  })) || [],
  deliveryAddress: 'Địa chỉ từ hệ thống', // Backend doesn't store delivery address
  submittedAt: apiRequest.created_at || new Date().toISOString(),
  lastUpdatedAt: apiRequest.created_at || new Date().toISOString(),
  status: apiRequest.status,
  statusReason: apiRequest.status_reason || getDefaultStatusReason(apiRequest.status),
  forcePostponed: false
});

const getDefaultStatusReason = (status: string): string => {
  switch (status) {
    case 'processing':
      return 'Yêu cầu của bạn đã được tiếp nhận và đang chờ xử lý.';
    case 'confirmed':
      return 'Đơn hàng đã được xác nhận và đang chuẩn bị giao hàng.';
    case 'postponed':
      return 'Tạm hoãn do không đủ hàng tồn kho. Vui lòng chờ bổ sung hàng.';
    default:
      return '';
  }
};

const schema = yup.object({
  products: yup.array().of(
    yup.object({
      productId: yup.string().required('Vui lòng chọn sản phẩm'),
      quantity: yup.number().required('Vui lòng nhập số lượng').min(1, 'Số lượng phải lớn hơn 0'),
      unit: yup.string(), // Not required validation since it's auto-filled
    })
  ).min(1, 'Vui lòng chọn ít nhất 1 sản phẩm'),
  deliveryAddress: yup.string().required('Vui lòng nhập địa chỉ giao hàng').min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
});

const DistributionRequestPage: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<DistributionRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DistributionRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [forcePostponed, setForcePostponed] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<DistributionFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      products: [{ productId: '', quantity: 1, unit: '' }],
      deliveryAddress: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'products' });

  // Watch for product selection changes to auto-fill unit
  const watchedProducts = useWatch({ control, name: 'products' });

  // Auto-fill unit when product is selected
  useEffect(() => {
    watchedProducts?.forEach((product, index) => {
      if (product.productId) {
        const selectedProduct = products.find(p => String(p.item_id) === product.productId);
        if (selectedProduct && selectedProduct.unit_name) {
          setValue(`products.${index}.unit`, selectedProduct.unit_name);
        }
      }
    });
  }, [watchedProducts, products, setValue]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Loading distribution data for user:', user);
        
        // Load products and requests in parallel
        const [productsResponse, requestsResponse] = await Promise.all([
          distributionApi.getProducts({ limit: 100 }),
          user?.agency_id ? distributionApi.getDistributionRequests({ 
            agency_id: user.agency_id,
            limit: 50 
          }) : Promise.resolve({ results: [] })
        ]);

        console.log('Products response:', productsResponse);
        console.log('Requests response:', requestsResponse);
        
        setProducts(productsResponse.results);
        // Gọi thêm API chi tiết cho từng request trước khi setRequests
        const rawRequests = requestsResponse.results || [];
        const detailedApiRequests = await Promise.all(
          rawRequests.map(req => distributionApi.getDistributionRequest(req.issue_id))
        );
        setRequests(detailedApiRequests.map(transformApiToFrontend));
      } catch (error: any) {
        console.error('Error loading distribution data:', error);
        console.error('Error details:', error.response?.data, error.response?.status);
        
        let errorMessage = 'Có lỗi khi tải dữ liệu. Vui lòng thử lại.';
        if (error.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        }
        
        setNotification({
          type: 'error',
          message: errorMessage
        });
        setTimeout(() => setNotification(null), 5000);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      console.log('User exists, loading data...', user);
      loadData();
    } else {
      console.log('No user found, skipping data load');
      setIsLoading(false);
    }
  }, [user]);

  // Periodic refresh to check for status updates
  useEffect(() => {
    if (!user?.agency_id) return;

    const interval = setInterval(async () => {
      try {
        const response = await distributionApi.getDistributionRequests({ 
          agency_id: user.agency_id,
          limit: 50 
        });
        // Gọi API chi tiết khi refresh dữ liệu
        const rawRefRequests = response.results || [];
        const detailedRefRequests = await Promise.all(
          rawRefRequests.map(req => distributionApi.getDistributionRequest(req.issue_id))
        );
        const newRequests = detailedRefRequests.map(transformApiToFrontend);
        
        // Check for status changes
        const oldRequests = requests;
        newRequests.forEach(newRequest => {
          const oldRequest = oldRequests.find(r => r.id === newRequest.id);
          if (oldRequest && oldRequest.status !== newRequest.status) {
            setNotification({
              type: newRequest.status === 'confirmed' ? 'success' : 'info',
              message: `Đơn hàng ${newRequest.id} đã được cập nhật: ${getStatusText(newRequest.status)}`
            });
            setTimeout(() => setNotification(null), 5000);
          }
        });
        
        setRequests(newRequests);
      } catch (error) {
        console.error('Error refreshing requests:', error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user, requests]);

  const addProductLine = () => append({ productId: '', quantity: 1, unit: '' });
  const removeProductLine = (idx: number) => {
    if (fields.length > 1) remove(idx);
  };

  const getProductName = (productId: string) => 
    products.find(p => String(p.item_id) === productId)?.item_name || 'Sản phẩm không xác định';

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'processing': return 'Đang xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'postponed': return 'Tạm hoãn';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const onSubmit = async (data: DistributionFormData) => {
    if (!user?.agency_id) {
      setNotification({
        type: 'error',
        message: 'Không xác định được đại lý. Vui lòng đăng nhập lại.'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const createData: CreateDistributionRequest = {
        agency_id: user.agency_id,
        items: data.products.map(product => {
          const productInfo = products.find(p => String(p.item_id) === product.productId);
          const basePrice = Number(productInfo?.price || 0);
          const exportPrice = Math.round(basePrice * 1.02); // 102% của giá nhập
          
          return {
            item: product.productId,
            quantity: product.quantity,
            unit_price: exportPrice
          };
        }),
        delivery_address: data.deliveryAddress
      };

      const newApiRequest = await distributionApi.createDistributionRequest(createData);
      const newRequest = transformApiToFrontend(newApiRequest);
      
      setRequests(prev => [newRequest, ...prev]);
      reset();
      setForcePostponed(false);
      
      setNotification({
        type: 'success',
        message: `Đã gửi yêu cầu thành công! Mã đơn: ${newRequest.id}`
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error: any) {
      console.error('Error creating distribution request:', error);
      
      // Handle specific business rule errors
      let errorMessage = 'Có lỗi khi tạo yêu cầu. Vui lòng thử lại.';
      
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        if (errorData.code === 'DEBT_LIMIT') {
          errorMessage = `Vượt quá hạn mức công nợ. Hạn mức: ${errorData.max_debt}, Hiện tại: ${errorData.current_debt}`;
        } else if (errorData.code === 'OUT_OF_STOCK') {
          errorMessage = `Không đủ hàng tồn kho cho ${errorData.item_name}. Còn lại: ${errorData.available_qty}`;
        }
      }
      
      setNotification({
        type: 'error',
        message: errorMessage
      });
      setTimeout(() => setNotification(null), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (request: DistributionRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedRequest(null);
  };

  const getStatusConfig = (status: DistributionRequest['status']) => {
    switch (status) {
      case 'processing': 
        return { 
          text: 'Đang xử lý', 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: Clock,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600'
        };
      case 'postponed': 
        return { 
          text: 'Tạm hoãn', 
          color: 'bg-amber-100 text-amber-800 border-amber-200', 
          icon: AlertCircle,
          bgColor: 'bg-amber-50',
          iconColor: 'text-amber-600'
        };
      case 'confirmed': 
        return { 
          text: 'Đã xác nhận', 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600'
        };
      case 'cancelled':
        return { 
          text: 'Đã hủy', 
          color: 'bg-red-100 text-red-800 border-red-200', 
          icon: X,
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600'
        };
      default:
        return { 
          text: 'Không xác định', 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600">Vui lòng đăng nhập để sử dụng tính năng này</p>
        </div>
      </div>
    );
  }

  if (!user.agency_id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-lg text-amber-600">Chỉ tài khoản đại lý mới có thể tạo yêu cầu phân phối</p>
          <p className="text-sm text-gray-500 mt-2">User role: {user.account_role} | User ID: {user.id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
          'bg-blue-50 border-blue-400 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {notification.type === 'info' && <Clock className="h-5 w-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hệ thống Phân phối Hàng hóa
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gửi yêu cầu phân phối sản phẩm một cách nhanh chóng và theo dõi trạng thái real-time
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Send className="h-6 w-6" />
                  Tạo yêu cầu mới
                </h2>
                <p className="text-blue-100 mt-1">Điền thông tin chi tiết để gửi yêu cầu phân phối</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                {/* Products Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      Danh sách sản phẩm
                      <span className="text-red-500">*</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addProductLine}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Thêm sản phẩm
                    </button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((item, idx) => (
                      <div key={item.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Sản phẩm
                            </label>
                            <select
                              {...register(`products.${idx}.productId` as const)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="">Chọn sản phẩm...</option>
                              {products.map((product) => {
                                const basePrice = Number(product.price);
                                const exportPrice = Math.round(basePrice * 1.02); // 102% của giá nhập
                                return (
                                  <option key={product.item_id} value={String(product.item_id)}>
                                    {product.item_name} - {product.unit_name} (Giá xuất: {exportPrice.toLocaleString('vi-VN')} VND)
                                  </option>
                                );
                              })}
                            </select>
                            {errors.products?.[idx]?.productId && (
                              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.products[idx]?.productId?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Số lượng
                            </label>
                            <input
                              type="number"
                              min={1}
                              {...register(`products.${idx}.quantity` as const)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            {errors.products?.[idx]?.quantity && (
                              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.products[idx]?.quantity?.message}
                              </p>
                            )}
                          </div>

                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Đơn vị tính
                              </label>
                              <input
                                {...register(`products.${idx}.unit` as const)}
                                readOnly
                                placeholder="Tự động điền từ sản phẩm"
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 cursor-not-allowed"
                              />
                            </div>
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProductLine(idx)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Địa chỉ giao hàng
                    <span className="text-red-500">*</span>
                  </h3>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <textarea
                      {...register('deliveryAddress')}
                      rows={4}
                      placeholder="Nhập địa chỉ chi tiết bao gồm số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                      className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                    <p className="text-green-700 text-sm mt-2">
                      💡 Địa chỉ chi tiết giúp quá trình giao hàng được nhanh chóng và chính xác
                    </p>
                  </div>
                </div>

                {/* Test Tools */}
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-3">🔧 Công cụ Test</h4>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={forcePostponed}
                      onChange={(e) => setForcePostponed(e.target.checked)}
                      className="w-4 h-4 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-amber-800">
                      Buộc trạng thái "Tạm hoãn" cho yêu cầu tiếp theo
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Đang gửi yêu cầu...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Gửi yêu cầu phân phối
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5 inline mr-2" />
                    Làm mới
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Requests History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Lịch sử đơn hàng
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {requests.length} yêu cầu
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {requests.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">Chưa có yêu cầu nào</p>
                    <p className="text-sm">Tạo yêu cầu đầu tiên của bạn</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {requests.map((request) => {
                      const statusConfig = getStatusConfig(request.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <div
                          key={request.id}
                          onClick={() => handleViewDetails(request)}
                          className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 hover:border-blue-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">#{request.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                {statusConfig.text}
                              </span>
                            </div>
                            <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              <span>{request.products.length} sản phẩm</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(request.submittedAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>

                          {request.status === 'postponed' && (
                            <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-xs text-amber-800 font-medium">
                                ⚠️ {request.statusReason}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
          <div className="flex items-start gap-6">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Thông tin quan trọng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Xử lý trong 24-48 giờ làm việc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Kiểm tra hạn mức sản phẩm</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Địa chỉ phải chính xác</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm">Cập nhật trạng thái tự động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${getStatusConfig(selectedRequest.status).bgColor}`}>
                    {React.createElement(getStatusConfig(selectedRequest.status).icon, {
                      className: `h-6 w-6 ${getStatusConfig(selectedRequest.status).iconColor}`
                    })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Chi tiết đơn hàng #{selectedRequest.id}
                    </h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusConfig(selectedRequest.status).color}`}>
                      {getStatusConfig(selectedRequest.status).text}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Message */}
              <div className={`p-4 rounded-2xl border ${
                selectedRequest.status === 'confirmed' ? 'bg-green-50 border-green-200' :
                selectedRequest.status === 'postponed' ? 'bg-amber-50 border-amber-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <p className={`font-medium ${
                  selectedRequest.status === 'confirmed' ? 'text-green-800' :
                  selectedRequest.status === 'postponed' ? 'text-amber-800' :
                  'text-blue-800'
                }`}>
                  {selectedRequest.statusReason}
                </p>
              </div>

              {/* Order Information */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" /> Mã đơn hàng
                    </h3>
                    <p className="text-lg font-mono text-blue-900">#{selectedRequest.id}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-600" /> Thời gian gửi
                    </h3>
                    <p className="text-base text-gray-700">{new Date(selectedRequest.submittedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" /> Cập nhật lần cuối
                    </h3>
                    <p className="text-base text-gray-700">{new Date(selectedRequest.lastUpdatedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-600" /> Địa chỉ giao hàng
                    </h3>
                    <p className="text-base text-gray-700 whitespace-pre-line">{selectedRequest.deliveryAddress}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" /> Danh sách sản phẩm
                  </h3>
                  <div className="divide-y divide-gray-200">
                    {selectedRequest.products.map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="font-medium text-gray-800">{getProductName(product.productId)}</span>
                        <span className="text-gray-600">{product.quantity} {product.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={closeModal}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionRequestPage;