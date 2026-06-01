# Quyn Bakery - Website Bán Bánh Online

## Mô tả lý do xây dựng

Dự án **Quyn Bakery** là một website thương mại điện tử chuyên bán các loại bánh ngọt và bánh mặn, được xây dựng với mục đích:

- **Mở rộng kênh bán hàng**: Đưa sản phẩm bánh đến khách hàng thông qua kênh online, phục vụ nhu cầu đặt hàng tiện lợi 24/7.
- **Trải nghiệm mua sắm dễ dàng**: Cho phép khách hàng duyệt sản phẩm, xem chi tiết, thêm vào giỏ hàng và đặt hàng một cách nhanh chóng.
- **Quản lý đơn hàng hiệu quả**: Hệ thống giỏ hàng tự động giúp theo dõi sản phẩm, tính tổng tiền và quản lý đơn hàng.
- **Thực hành kỹ năng lập trình**: Dự án được xây dựng để rèn luyện và phát triển kỹ năng Front-end với Vanilla JavaScript, HTML và CSS.

---

## Flow (Luồng hoạt động)

### 1. Trang chủ (trangchu.html)
```
Khách hàng truy cập → Xem banner → Xem sản phẩm nổi bật theo danh mục
→ Thêm vào giỏ hàng hoặc Xem chi tiết sản phẩm
```

### 2. Trang danh sách sản phẩm (product-list.html)
```
Khách hàng → Xem tất cả sản phẩm → Lọc theo danh mục/ mức giá
→ Thêm vào giỏ hàng hoặc Xem chi tiết sản phẩm
```

### 3. Trang chi tiết sản phẩm (product.html)
```
Khách hàng → Xem thông tin chi tiết (tên, giá, mô tả, hình ảnh)
→ Chọn số lượng → Thêm vào giỏ hàng HOẶC Mua ngay
```

### 4. Trang giỏ hàng (cart.html)
```
Khách hàng → Xem danh sách sản phẩm trong giỏ → Tăng/giảm số lượng
→ Xóa sản phẩm → Xem tổng tiền → Thanh toán (checkout)
```

### 5. Thanh toán
```
Xác nhận đơn hàng → Hiển thị chi tiết đơn hàng → Xác nhận thanh toán
→ Xóa giỏ hàng → Chuyển về trang chủ
```

---

## Thuật ngữ

| Thuật ngữ | Mô tả |
|-----------|-------|
| **Product** | Sản phẩm bánh, bao gồm thông tin: id, name, price, oldPrice, image, category, desc |
| **Category** | Danh mục sản phẩm: mousse, bread salty, cake, bread, baked goods |
| **Cart** | Giỏ hàng, lưu trữ danh sách sản phẩm khách hàng chọn mua |
| **LocalStorage** | Nơi lưu trữ giỏ hàng để giữ dữ liệu khi reload trang |
| **FormatPrice** | Hàm định dạng giá tiền theo định dạng Việt Nam (VD: 100000 → 100.000) |
| **Quantity Control** | Bộ điều khiển số lượng (nút +/-) để tăng giảm số lượng sản phẩm |
| **Filter** | Bộ lọc sản phẩm theo danh mục hoặc mức giá |
| **Notification** | Thông báo hiển thị khi thêm sản phẩm vào giỏ hàng |

---

## Tính năng

### 1. Trang chủ
- Hiển thị banner giới thiệu
- Hiển thị sản phẩm nổi bật theo từng danh mục (Bánh Mousse, Bánh mặn, Bánh kem, Bánh mì, Bánh nướng)
- Thêm sản phẩm vào giỏ hàng trực tiếp
- Đếm số lượng sản phẩm trong giỏ hàng (badge)

### 2. Trang danh sách sản phẩm
- Hiển thị tất cả sản phẩm
- **Lọc theo danh mục**: Mousse, Bánh mặn, Bánh kem, Bánh mì, Bánh nướng
- **Lọc theo mức giá**:
  - Dưới 100k
  - 100k - 300k
  - Trên 300k
- Thêm sản phẩm vào giỏ hàng
- Xem chi tiết sản phẩm

### 3. Trang chi tiết sản phẩm
- Hiển thị thông tin đầy đủ: hình ảnh, tên, danh mục, giá, giá cũ, mô tả
- **Chọn kích thước bánh** (16cm, 20cm, 25cm) - UI đã có
- **Chọn số lượng**: Nút +/- để tăng giảm số lượng
- **Thêm vào giỏ hàng**: Thêm sản phẩm với số lượng đã chọn
- **Mua ngay**: Thêm vào giỏ hàng và chuyển hướng sang trang giỏ hàng

### 4. Trang giỏ hàng
- Hiển thị danh sách sản phẩm trong giỏ hàng
- **Tăng/giảm số lượng**: Sử dụng nút +/- hoặc nhập trực tiếp
- **Xóa sản phẩm**: Xóa từng sản phẩm hoặc xóa toàn bộ giỏ hàng
- **Tính tổng tiền**: Tự động tính tổng tiền dựa trên số lượng và giá
- **Thanh toán**: Xác nhận đơn hàng và hoàn tất đặt hàng
- **Thông báo giỏ hàng trống**: Khi không có sản phẩm nào

### 5. Tính năng chung
- **Định dạng giá tiền**: Hiển thị giá theo định dạng Việt Nam
- **Thông báo**: Hiển thị thông báo khi thêm/xóa/cập nhật sản phẩm
- **Đếm giỏ hàng**: Badge số lượng trên icon giỏ hàng
- **Search dropdown**: UI tìm kiếm sản phẩm (chưa kết nối backend)
- **Responsive**: Giao diện thích ứng với các kích thước màn hình khác nhau

---

## Cấu trúc dự án

```
demo/
├── html/
│   ├── trangchu.html          # Trang chủ
│   ├── product-list.html      # Danh sách sản phẩm
│   ├── product.html           # Chi tiết sản phẩm
│   └── cart.html              # Giỏ hàng
├── js/
│   ├── common.js              # Hàm dùng chung (formatPrice, cart, notification, quantity)
│   ├── product.js             # Dữ liệu sản phẩm (mock data)
│   ├── home.js                # Xử lý trang chủ
│   ├── product-list.js        # Xử lý danh sách sản phẩm + filter
│   ├── product-detail.js      # Xử lý chi tiết sản phẩm + thêm giỏ hàng
│   └── cart.js                # Xử lý giỏ hàng + thanh toán
├── css/
│   ├── main.css               # Style chung
│   ├── banner.css             # Style banner
│   ├── product-detail.css     # Style trang chi tiết
│   ├── product-list.css       # Style danh sách sản phẩm
│   ├── cart.css               # Style giỏ hàng
│   └── common/
│       ├── menu.css           # Style menu
│       ├── card.css           # Style card sản phẩm
│       └── footer.css         # Style footer
└── assets/
    └── image/                 # Hình ảnh sản phẩm và UI
```

---

## Công nghệ sử dụng

- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling, flexbox, grid
- **Vanilla JavaScript**: Xử lý logic, không sử dụng framework
- **LocalStorage**: Lưu trữ giỏ hàng client-side

---

## Những điểm cần bổ sung

### 1. Backend & Database
- [ ] Kết nối với backend API (Node.js/PHP/Python)
- [ ] Lưu trữ sản phẩm trong database thay vì mock data
- [ ] Quản lý đơn hàng server-side
- [ ] Xác thực người dùng (login/register)

### 2. Tính năng tìm kiếm & Lọc
- [ ] Kết nối search dropdown với logic tìm kiếm sản phẩm
- [ ] Tìm kiếm theo tên sản phẩm
- [ ] Lọc theo giá (range slider) thay vì checkbox
- [ ] Sắp xếp sản phẩm (giá tăng/giảm, tên A-Z)

### 3. Trang người dùng
- [ ] Trang đăng ký/đăng nhập
- [ ] Trang profile người dùng
- [ ] Lịch sử đơn hàng
- [ ] Quản lý thông tin giao hàng

### 4. Trang thanh toán
- [ ] Form nhập thông tin giao hàng (tên, SĐT, địa chỉ)
- [ ] Chọn phương thức thanh toán (COD, chuyển khoản, ví điện tử)
- [ ] Xác thực thông tin đầu vào
- [ ] Gửi đơn hàng về server

### 5. Trang quản trị (Admin)
- [ ] Quản lý sản phẩm (thêm/sửa/xóa)
- [ ] Quản lý đơn hàng
- [ ] Quản lý danh mục
- [ ] Thống kê báo cáo

### 6. Chức năng khác
- [ ] Đánh giá sản phẩm (rating, review)
- [ ] Giỏ hàng lưu trữ lâu dài (đăng nhập)
- [ ] Mã giảm giá (coupon)
- [ ] Tính phí ship dựa trên địa chỉ
- [ ] Notification khi có đơn hàng mới (email/SMS)
- [ ] Share sản phẩm lên mạng xã hội

### 7. Cải tiến UI/UX
- [ ] Loading state khi đang render sản phẩm
- [ ] Error handling khi không tìm thấy sản phẩm
- [ ] Animation khi thêm sản phẩm vào giỏ
- [ ] Responsive tốt hơn cho mobile
- [ ] Dark mode

---

## Cài đặt và chạy

```bash
# Clone repository
git clone <repository-url>

# Mở file trangchu.html trong trình duyệt
# Hoặc sử dụng Live Server (VS Code extension)
```

---

## Đóng góp

Dự án này là đồ án học tập, mọi đóng góp để cải thiện code đều được chào đón!

---

## Tác giả

- **Tên**: Quyn Bakery
- **Email**: tranhanhu252506@gmail.com
- **Năm**: 2026

---

## License

© 2026 Quyn Bakery. All rights reserved.
