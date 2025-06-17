# Agency System - Hệ thống quản lý đại lý

## Tổng quan
Trang Agency được thiết kế dành riêng cho các đại lý phân phối, tập trung vào 5 chức năng cốt lõi phù hợp với mô hình kinh doanh đại lý.

## 5 Chức năng chính (Dựa trên mau-agency)

### 1. Quản lý xuất hàng (`/export`) 📤
**Dựa trên**: `Quản lý xuất hàng.png`
- **Mục đích**: Quản lý việc bán hàng cho khách hàng cuối
- **Chức năng chi tiết**:
  - Tạo đơn bán hàng cho khách lẻ
  - Quản lý giá bán theo chính sách
  - Theo dõi trạng thái giao hàng
  - In hóa đơn VAT và phiếu xuất kho
  - Thống kê doanh thu bán lẻ
  - Quản lý khách hàng thường xuyên

### 2. Nhận hàng (`/import`) 📥
**Dựa trên**: `UC05-08 Nhận hàng.png`
- **Mục đích**: Tiếp nhận hàng hóa từ công ty mẹ
- **Chức năng chi tiết**:
  - Nhận thông báo hàng từ công ty
  - Xác nhận lịch giao hàng
  - Kiểm tra số lượng khi nhận hàng
  - Báo cáo hàng hỏng/thiếu/thừa
  - Cập nhật tồn kho tự động
  - Ký xác nhận phiếu giao nhận

### 3. Gửi yêu cầu phân phối (`/agencies`) 📋
**Dựa trên**: `UC05-07 Gửi yêu cầu phân phối.png`
- **Mục đích**: Đặt hàng từ công ty mẹ
- **Chức năng chi tiết**:
  - Tạo đơn đặt hàng mới
  - Chọn sản phẩm và số lượng
  - Đánh giá nhu cầu thị trường
  - Theo dõi trạng thái đơn hàng
  - Hủy/sửa đơn (nếu chưa xử lý)
  - Lịch sử đặt hàng và phân tích xu hướng

### 4. Lập báo cáo (`/search`) 📊
**Dựa trên**: `Lập báo cáo.png`
- **Mục đích**: Báo cáo hoạt động kinh doanh
- **Chức năng chi tiết**:
  - Báo cáo doanh thu theo thời gian
  - Báo cáo tồn kho và luân chuyển
  - Báo cáo công nợ với công ty
  - Phân tích sản phẩm bán chạy
  - Báo cáo khách hàng và thị trường
  - Xuất Excel/PDF gửi công ty

### 5. Quản lý thanh toán (`/payment`) 💰
**Dựa trên**: `Quản lý thanh toán.png`
- **Mục đích**: Quản lý tài chính và thanh toán
- **Chức năng chi tiết**:
  - Thanh toán công nợ với công ty
  - Quản lý hạn mức tín dụng
  - Theo dõi dòng tiền vào/ra
  - Lập phiếu thu từ khách hàng
  - Quản lý các khoản phí (vận chuyển, hoa hồng)
  - Đối soát công nợ định kỳ

## Đặc điểm thiết kế Agency

### **Model kinh doanh đại lý** 🏪
- **B2B2C**: Mua từ công ty, bán cho khách cuối
- **Tồn kho riêng**: Quản lý warehouse độc lập
- **Tín dụng**: Có hạn mức và thời hạn thanh toán
- **Khu vực**: Phục vụ khách hàng trong vùng phân định

### **Quy trình hoạt động** 🔄
```
Đặt hàng → Nhận hàng → Bán lẻ → Thanh toán → Báo cáo
    ↑                                              ↓
    ←───────────── Phân tích & Lập kế hoạch ────────
```

### **Mối quan hệ với công ty mẹ** 🤝
- **Tuân thủ**: Giá bán, chính sách, quy định
- **Báo cáo**: Định kỳ hàng tháng/quý
- **Hỗ trợ**: Nhận support kỹ thuật và marketing
- **Cạnh tranh**: Healthy competition với đại lý khác

## Phân biệt với Staff/Admin

| Tính năng | Admin | Staff | **Agency** |
|-----------|-------|-------|------------|
| **Phạm vi** | Toàn hệ thống | Nội bộ công ty | **Một đại lý** |
| **Quyền hạn** | Cao nhất | Hạn chế | **Tự quản trong phạm vi** |
| **Dữ liệu** | Toàn bộ | Theo phân quyền | **Chỉ của đại lý** |
| **Mục tiêu** | Quản trị | Vận hành | **Kinh doanh** |

## Cấu hình kỹ thuật

### **Navigation thứ tự ưu tiên**
1. 📤 **Quản lý xuất hàng** (Trang chủ - doanh thu)
2. 📥 **Nhận hàng** (Quản lý tồn kho)
3. 📋 **Gửi yêu cầu phân phối** (Đặt hàng)
4. 📊 **Lập báo cáo** (Phân tích)
5. 💰 **Quản lý thanh toán** (Tài chính)

### **Theme & Branding**
- **Logo**: "Agency" thay vì "Admin/Staff"
- **User role**: "Đại lý" 
- **Avatar**: "A" (Agency)
- **Màu sắc**: Giữ nguyên blue theme cho nhất quán

### **Routes mapping**
- `/` → `/export` (Trang chủ: Quản lý xuất hàng)
- `/export/*` → Quản lý xuất hàng
- `/import/*` → Nhận hàng
- `/agencies/*` → Gửi yêu cầu phân phối
- `/search/*` → Lập báo cáo
- `/payment/*` → Quản lý thanh toán

## Roadmap phát triển

### **Phase 1: Core Functions (2 tuần)**
- [ ] Hoàn thiện giao diện 5 trang chính
- [ ] Tích hợp với API backend
- [ ] Authentication và phân quyền đại lý

### **Phase 2: Business Logic (2 tuần)**
- [ ] Tính toán tự động (tồn kho, công nợ)
- [ ] Workflow đặt hàng - nhận hàng
- [ ] Báo cáo và analytics

### **Phase 3: Integration (1 tuần)**
- [ ] Sync với hệ thống công ty mẹ
- [ ] Email notifications
- [ ] Mobile responsive

## Cách triển khai

```bash
# Setup agency system
cd agency
npm install
npm run dev

# Truy cập: http://localhost:5173
# Mặc định: Trang quản lý xuất hàng
```

**Agency system sẽ chạy độc lập với admin/staff và có thể deploy riêng biệt cho từng đại lý.** 