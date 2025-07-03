import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Plus, Trash2, Package, Building, Calendar, User } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

// Interface cho agency từ API
interface Agency {
  id: number;
  code: string;
  name: string;
  type: string;
  district: string;
  current_debt: string;
  debt_limit: number;
  is_active: boolean;
}

// Interface cho item từ API  
interface Item {
  item_id: number;
  item_name: string;
  unit: number;
  unit_name: string;
  price: string;
  stock_quantity: number;
  description: string;
}

// Interface cho product trong form
interface ProductFormData {
  item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  totalPrice: number;
}

const AddImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const [formData, setFormData] = useState({
    agency_id: '',
    receipt_date: new Date().toISOString().split('T')[0],
    products: [
      { item_id: 0, item_name: '', quantity: 0, unit_price: 0, totalPrice: 0 },
    ] as ProductFormData[],
  });

  // Load data từ API
  useEffect(() => {
    Promise.all([fetchAgencies(), fetchItems()]);
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await axiosClient.get('/agency/');
      setAgencies(response.data.results || []);
    } catch (err: any) {
      console.error('Error fetching agencies:', err);
      setError('Không thể tải danh sách đại lý');
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axiosClient.get('/inventory/items/');
      setItems(response.data.results || []);
    } catch (err: any) {
      console.error('Error fetching items:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...formData.products];
    
    if (field === 'item_id') {
      // Khi chọn sản phẩm mới, auto-fill thông tin
      const selectedItem = items.find(item => item.item_id === Number(value));
      if (selectedItem) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          item_id: selectedItem.item_id,
          item_name: selectedItem.item_name,
          unit_price: parseFloat(selectedItem.price),
        };
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      };
    }
    
    // Tính lại totalPrice
    const quantity = updatedProducts[index].quantity;
    const unitPrice = updatedProducts[index].unit_price;
    updatedProducts[index].totalPrice = quantity * unitPrice;
    
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { item_id: 0, item_name: '', quantity: 0, unit_price: 0, totalPrice: 0 }],
    });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const calculateTotal = () => {
    return formData.products.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // Validate form data
      if (!formData.agency_id) {
        throw new Error('Vui lòng chọn đại lý');
      }
      
      if (!formData.receipt_date) {
        throw new Error('Vui lòng chọn ngày nhập');
      }

      const validProducts = formData.products.filter(p => p.item_id > 0 && p.quantity > 0);
      if (validProducts.length === 0) {
        throw new Error('Vui lòng thêm ít nhất một sản phẩm');
      }

      // Prepare API payload
      const payload = {
        agency_id: parseInt(formData.agency_id),
        receipt_date: formData.receipt_date,
        details: validProducts.map(product => ({
          item: product.item_id,
          quantity: product.quantity
        }))
      };

      console.log('Submitting receipt:', payload);

      // Gọi API tạo receipt
      const response = await axiosClient.post('/inventory/receipts/', payload);
      
      console.log('Receipt created:', response.data);
      
      // Redirect về trang danh sách với thông báo thành công
      navigate('/import', { 
        state: { 
          message: `Phiếu nhập PX${String(response.data.receipt_id).padStart(3, '0')} đã được tạo thành công!` 
        }
      });

    } catch (err: any) {
      console.error('Error creating receipt:', err);
      setError(err.response?.data?.detail || err.message || 'Có lỗi xảy ra khi tạo phiếu nhập');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide">Tạo phiếu nhập</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="inline w-4 h-4 mr-1" />
                  Đại lý
                </label>
                <select
                  name="agency_id"
                  value={formData.agency_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn đại lý</option>
                  {agencies.filter(agency => agency.is_active).map(agency => (
                    <option key={agency.id} value={agency.id}>
                      {agency.code} - {agency.name} ({agency.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Ngày nhập
                </label>
                <input
                  type="date"
                  name="receipt_date"
                  value={formData.receipt_date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Danh sách sản phẩm nhập
            </h2>
            
            <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
              <table className="min-w-full bg-white border border-blue-200">
                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                  <tr className="uppercase text-sm">
                    <th className="py-3 px-4 text-left">Sản phẩm</th>
                    <th className="py-3 px-4 text-left">Số lượng</th>
                    <th className="py-3 px-4 text-left">Đơn giá</th>
                    <th className="py-3 px-4 text-left">Thành tiền</th>
                    <th className="py-3 px-4 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {formData.products.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <select
                          value={product.item_id}
                          onChange={(e) => handleProductChange(index, 'item_id', Number(e.target.value))}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={0}>Chọn sản phẩm</option>
                          {items.map(item => (
                            <option key={item.item_id} value={item.item_id}>
                              {item.item_name} ({item.unit_name}) - {parseFloat(item.price).toLocaleString()} đ
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.unit_price}
                          onChange={(e) => handleProductChange(index, 'unit_price', Number(e.target.value))}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">
                        {product.totalPrice.toLocaleString()} đ
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="px-3 py-1 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              type="button"
              onClick={addProduct}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </button>

            <div className="mt-6 text-right text-lg font-bold text-gray-800 bg-blue-50 p-4 rounded-lg">
              Tổng tiền: {calculateTotal().toLocaleString()} đ
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/import')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  'Lưu phiếu nhập'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddImportPage;
