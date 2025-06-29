# Agency Management System

Đây là trang quản lý dành cho đại lý, được xây dựng dựa trên cấu trúc tương tự như trang admin nhưng tập trung vào 5 chức năng chính phù hợp với vai trò đại lý.

## Tính năng chính

### 1. Quản lý xuất hàng
- Tạo đơn xuất hàng cho khách hàng cuối
- Xem danh sách các đơn xuất hàng
- Cập nhật trạng thái giao hàng
- In hóa đơn và phiếu giao hàng
- Theo dõi doanh thu bán lẻ

### 2. Nhận hàng (từ công ty)
- Xem thông báo hàng gửi từ công ty
- Xác nhận nhận hàng
- Kiểm tra số lượng và chất lượng hàng hóa
- Cập nhật tồn kho sau khi nhận hàng
- Báo cáo hàng hỏng/thiếu (nếu có)

### 3. Gửi yêu cầu phân phối
- Tạo đơn đặt hàng gửi lên công ty
- Xem lịch sử các yêu cầu đã gửi
- Theo dõi trạng thái xử lý đơn hàng
- Hủy/chỉnh sửa đơn hàng (nếu chưa xử lý)
- Quản lý nhu cầu hàng hóa

### 4. Lập báo cáo
- Báo cáo doanh thu theo ngày/tháng
- Báo cáo tồn kho hiện tại
- Báo cáo công nợ với công ty
- Thống kê khách hàng và sản phẩm bán chạy
- Xuất báo cáo Excel/PDF

### 5. Quản lý thanh toán
- Thanh toán công nợ với công ty
- Xem lịch sử giao dịch tài chính
- Theo dõi hạn mức tín dụng
- Quản lý các khoản thu từ khách hàng
- In biên lai và chứng từ

## Cách chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy ở chế độ development
npm run dev

# Build cho production
npm run build

# Preview bản build
npm run preview
```

## Cấu trúc dự án

- `src/` - Source code chính
  - `components/` - Các React components
  - `routes/` - Các trang và routing
    - `export/` - Quản lý xuất hàng
    - `import/` - Nhận hàng từ công ty
    - `agencies/` - Gửi yêu cầu phân phối
    - `search/` - Lập báo cáo
    - `payment/` - Quản lý thanh toán
    - `auth/` - Xác thực người dùng
  - `hooks/` - Custom React hooks
  - `api/` - Các API calls
  - `assets/` - Tài nguyên tĩnh

## Đặc điểm của Agency System

### **Quan hệ với công ty** 🏢
- Nhận hàng từ công ty mẹ
- Có hạn mức tín dụng nhất định
- Báo cáo định kỳ lên công ty
- Tuân thủ chính sách giá và khuyến mãi

### **Kinh doanh bán lẻ** 🛒
- Bán hàng trực tiếp cho khách hàng cuối
- Quản lý tồn kho riêng
- Tự chịu trách nhiệm về doanh thu
- Cạnh tranh với các đại lý khác trong khu vực

### **Quy trình làm việc** 📋
1. **Đặt hàng**: Gửi yêu cầu lên công ty
2. **Nhận hàng**: Xác nhận và nhập kho
3. **Bán hàng**: Xuất hàng cho khách cuối
4. **Thanh toán**: Quyết toán với công ty
5. **Báo cáo**: Gửi báo cáo định kỳ

## Phân quyền Agency

- **Không thể**: Thay đổi giá bán, chính sách công ty
- **Có thể**: Quản lý kho, bán hàng, báo cáo
- **Hạn chế**: Chỉ xem dữ liệu của đại lý mình
- **Bắt buộc**: Tuân thủ quy định của công ty mẹ
# agency
