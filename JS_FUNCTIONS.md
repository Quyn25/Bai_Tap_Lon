# Giải thích các hàm trong JavaScript - Quyn Bakery

Dưới đây là giải thích chi tiết từng hàm trong các file JavaScript của dự án.

---

## 1. common.js - Các hàm dùng chung

File này chứa các hàm được sử dụng chung trong toàn bộ ứng dụng.

### 1.1. `formatPrice(price)`
```javascript
function formatPrice(price) {
    return price.toLocaleString("vi-VN");
}
```
**Chức năng**: Định dạng giá tiền theo định dạng Việt Nam.

**Tham số**:
- `price` (number): Giá tiền cần định dạng

**Kết quả**: Chuỗi giá đã định dạng (VD: 100000 → "100.000")

**Ví dụ**:
```javascript
formatPrice(250000) // "250.000"
formatPrice(1500000) // "1.500.000"
```

---

### 1.2. `getCart()`
```javascript
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}
```
**Chức năng**: Lấy danh sách sản phẩm trong giỏ hàng từ localStorage.

**Kết quả**: Mảng các sản phẩm trong giỏ hàng (rỗng nếu chưa có)

**Luồng hoạt động**:
1. Đọc cart từ localStorage
2. Nếu có, parse từ JSON sang object
3. Nếu không, trả về mảng rỗng

---

### 1.3. `saveCart(cart)`
```javascript
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(cart)
    }));
}
```
**Chức năng**: Lưu giỏ hàng vào localStorage và kích hoạt sự kiện đồng bộ.

**Tham số**:
- `cart` (Array): Mảng các sản phẩm cần lưu

**Luồng hoạt động**:
1. Chuyển mảng cart thành JSON string
2. Lưu vào localStorage với key 'cart'
3. Kích hoạt StorageEvent để các tab khác biết giỏ hàng đã thay đổi

---

### 1.4. `calculateTotal(cart)`
```javascript
function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
```
**Chức năng**: Tính tổng tiền của giỏ hàng.

**Tham số**:
- `cart` (Array): Mảng các sản phẩm trong giỏ hàng

**Kết quả**: Tổng tiền (number)

**Công thức**: Σ (price × quantity) cho từng sản phẩm

**Ví dụ**:
```javascript
calculateTotal([
    {price: 100000, quantity: 2},
    {price: 50000, quantity: 1}
]) // 250000
```

---

### 1.5. `getTotalItems(cart)`
```javascript
function getTotalItems(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
}
```
**Chức năng**: Tính tổng số lượng sản phẩm trong giỏ hàng.

**Tham số**:
- `cart` (Array): Mảng các sản phẩm trong giỏ hàng

**Kết quả**: Tổng số lượng (number)

**Lưu ý**: Đây là tổng số lượng sản phẩm, KHÔNG phải tổng tiền.

---

### 1.6. `updateCartCount()`
```javascript
function updateCartCount() {
    const cart = getCart();
    const totalItems = getTotalItems(cart);

    let container = document.getElementById('cart-icon');
    let targetImg = container ? container.querySelector('#gio[src*="cart.svg"]') : null;

    if (!targetImg) {
        const cartIcons = document.querySelectorAll('#gio[src*="cart.svg"]');
        if (cartIcons.length > 0) {
            targetImg = cartIcons[0];
            container = targetImg.parentElement;
        }
    }

    if (!targetImg || !container) return;

    let badge = container.querySelector('.cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        container.appendChild(badge);
    }

    container.style.position = 'relative';
    badge.textContent = totalItems > 99 ? '9+' : totalItems;
}
```
**Chức năng**: Cập nhật số lượng hiển thị trên icon giỏ hàng (badge).

**Luồng hoạt động**:
1. Lấy giỏ hàng và tính tổng số lượng
2. Tìm icon giỏ hàng (hỗ trợ 2 cấu trúc HTML)
3. Tạo hoặc cập nhật badge hiển thị số lượng
4. Nếu > 99 hiển thị "9+"

---

### 1.7. `showNotification(message, type)`
```javascript
function showNotification(message, type = 'success') {
    let notification = document.querySelector('.cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add('show', type);

    setTimeout(() => {
        notification.classList.remove('show', type);
    }, 3000);
}
```
**Chức năng**: Hiển thị thông báo nổi (toast notification).

**Tham số**:
- `message` (string): Nội dung thông báo
- `type` (string): Loại thông báo - 'success', 'error', 'info' (mặc định 'success')

**Luồng hoạt động**:
1. Tạo hoặc tìm element notification
2. Hiển thị message
3. Tự động ẩn sau 3 giây

---

### 1.8. `themVaoGioHang(productId, event)`
```javascript
function themVaoGioHang(productId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error('Không tìm thấy sản phẩm!');
        return;
    }

    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    showNotification(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    updateCartCount();
}
```
**Chức năng**: Thêm sản phẩm vào giỏ hàng.

**Tham số**:
- `productId` (number): ID của sản phẩm cần thêm
- `event` (Event): Event object (optional)

**Luồng hoạt động**:
1. Ngăn chặn event lan truyền (nếu có)
2. Tìm sản phẩm theo ID trong mảng `products`
3. Lấy giỏ hàng hiện tại
4. Nếu sản phẩm đã có → tăng số lượng
5. Nếu chưa có → thêm mới
6. Lưu giỏ hàng
7. Hiển thị thông báo
8. Cập nhật badge số lượng

---

### 1.9. `increaseQuantity(target)`
```javascript
function increaseQuantity(target) {
    const quantityElement = typeof target === 'string'
        ? document.querySelector(target)
        : target;

    if (!quantityElement) return;

    let currentValue = 1;

    if (quantityElement.tagName === 'DIV') {
        currentValue = parseInt(quantityElement.innerText) || 1;
        quantityElement.innerText = currentValue + 1;
    }
    else if (quantityElement.tagName === 'INPUT') {
        currentValue = parseInt(quantityElement.value) || 1;
        quantityElement.value = currentValue + 1;
        quantityElement.dispatchEvent(new Event('change'));
    }
}
```
**Chức năng**: Tăng số lượng trong quantity control.

**Tham số**:
- `target` (string|HTMLElement): Selector hoặc element của quantity

**Đặc điểm**: Hỗ trợ cả DIV (product-detail) và INPUT (cart)

---

### 1.10. `decreaseQuantity(target, min)`
```javascript
function decreaseQuantity(target, min = 1) {
    const quantityElement = typeof target === 'string'
        ? document.querySelector(target)
        : target;

    if (!quantityElement) return;

    let currentValue = 1;

    if (quantityElement.tagName === 'DIV') {
        currentValue = parseInt(quantityElement.innerText) || 1;
        if (currentValue > min) {
            quantityElement.innerText = currentValue - 1;
        }
    }
    else if (quantityElement.tagName === 'INPUT') {
        currentValue = parseInt(quantityElement.value) || 1;
        if (currentValue > min) {
            quantityElement.value = currentValue - 1;
            quantityElement.dispatchEvent(new Event('change'));
        }
    }
}
```
**Chức năng**: Giảm số lượng trong quantity control.

**Tham số**:
- `target` (string|HTMLElement): Selector hoặc element
- `min` (number): Giá trị tối thiểu (mặc định 1)

---

### 1.11. `getQuantity(target)`
```javascript
function getQuantity(target) {
    const quantityElement = typeof target === 'string'
        ? document.querySelector(target)
        : target;

    if (!quantityElement) return 1;

    if (quantityElement.tagName === 'DIV') {
        return parseInt(quantityElement.innerText) || 1;
    } else if (quantityElement.tagName === 'INPUT') {
        return parseInt(quantityElement.value) || 1;
    }
    return 1;
}
```
**Chức năng**: Lấy giá trị số lượng hiện tại từ element.

---

### 1.12. Search Dropdown (Code trực tiếp)
```javascript
const searchBtn = document.querySelector('#gio[src*="search.svg"]');
const searchDropdown = document.getElementById("search-dropdown");

searchBtn.addEventListener("click", () => {
    searchDropdown.classList.toggle("active");

    if (searchDropdown.classList.contains("active")) {
        searchDropdown.querySelector("input").focus();
    }
});
```
**Chức năng**: Toggle dropdown tìm kiếm khi click icon search.

---

## 2. product.js - Dữ liệu sản phẩm

File này chứa **mảng dữ liệu** `products` - không có hàm, chỉ có data.

```javascript
const products = [
  {
    id: 1,
    name: "Mousse socola",
    price: 250000,
    oldPrice: 300000,
    image: "../assets/image/1.sp1.png",
    category: "mousse",
    desc: "Mô tả..."
  },
  // ... thêm 50+ sản phẩm khác
];
```

**Cấu trúc sản phẩm**:
| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | number | ID duy nhất của sản phẩm |
| name | string | Tên sản phẩm |
| price | number | Giá hiện tại |
| oldPrice | number\|null | Giá gốc (null nếu không có khuyến mãi) |
| image | string | Đường dẫn ảnh |
| category | string | Danh mục (mousse, bread salty, cake, bread, baked goods) |
| desc | string | Mô tả chi tiết |

---

## 3. home.js - Trang chủ

### 3.1. `renderProducts(category, containerId)`
```javascript
function renderProducts(category, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const filtered = products.filter((p) => p.category === category);

    filtered.forEach((p) => {
        container.innerHTML += `
            <div class="spham" data-product-id="${p.id}">
                <a href="product.html?id=${p.id}" class="spham-link">
                    <img src="${p.image}" alt="${p.name}">
                </a>
                <div><h3>${p.name}</h3></div>
                <div class="tien">
                    <div class="gia">
                        <p class="text-gia">
                            ${formatPrice(p.price)}<u>đ</u>
                            ${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}đ</del>` : ""}
                        </p>
                    </div>
                    <button class="hang" data-product-id="${p.id}">
                        <img src="../assets/image/shopping-cart.svg" alt="Thêm vào giỏ">
                    </button>
                </div>
            </div>
        `;
    });

    const cartButtons = container.querySelectorAll('.hang');
    cartButtons.forEach(button => {
        button.removeEventListener('click', handleCartClick);
        button.addEventListener('click', handleCartClick);
    });
}
```
**Chức năng**: Render sản phẩm theo category vào container.

**Tham số**:
- `category` (string): Category cần lọc (VD: "mousse", "cake")
- `containerId` (string): ID của container element

**Luồng hoạt động**:
1. Xóa nội dung cũ (tránh trùng lặp)
2. Lọc sản phẩm theo category
3. Render HTML cho từng sản phẩm
4. Gán sự kiện click cho nút thêm giỏ hàng

**Được gọi khi load trang**:
```javascript
renderProducts("mousse", "mousse");
renderProducts("bread salty", "bread salty");
renderProducts("cake", "cake");
renderProducts("bread", "bread");
renderProducts("baked goods", "baked goods");
```

---

### 3.2. `handleCartClick(event)`
```javascript
function handleCartClick(event) {
    event.stopPropagation();
    event.preventDefault();

    const productId = parseInt(event.currentTarget.getAttribute('data-product-id'));
    themVaoGioHang(productId, event);
}
```
**Chức năng**: Xử lý khi click nút thêm giỏ hàng ở trang chủ.

---

## 4. product-list.js - Danh sách sản phẩm & Filter

### 4.1. `filterByCategories(products, selectedCategories)`
```javascript
function filterByCategories(products, selectedCategories) {
    if (!selectedCategories.length) return products;
    return products.filter((p) => selectedCategories.includes(p.category));
}
```
**Chức năng**: Lọc sản phẩm theo nhiều category.

**Tham số**:
- `products` (Array): Mảng sản phẩm cần lọc
- `selectedCategories` (Array): Mảng category được chọn

**Kết quả**: Mảng sản phẩm đã lọc

**Ví dụ**:
```javascript
filterByCategories(products, ["mousse", "cake"])
// Trả về tất cả sản phẩm có category là "mousse" HOẶC "cake"
```

---

### 4.2. `getSelectedCategories()`
```javascript
function getSelectedCategories() {
    const checkboxes = document.querySelectorAll(
        '.filter-card input[type="checkbox"][name="category"]',
    );
    const selected = [];
    checkboxes.forEach((cb) => {
        if (cb.checked) {
            selected.push(cb.value);
        }
    });
    return selected;
}
```
**Chức năng**: Lấy danh sách category đang được chọn từ checkbox.

**Kết quả**: Mảng các category đã checked

---

### 4.3. `getSelectedPrices()`
```javascript
function getSelectedPrices() {
    const checkboxes = document.querySelectorAll(
        '.filter-card input[type="checkbox"][name="price"]',
    );
    const selected = [];
    checkboxes.forEach((cb) => {
        if (cb.checked) {
            selected.push(cb.value);
        }
    });
    return selected;
}
```
**Chức năng**: Lấy danh sách mức giá đang được chọn.

**Kết quả**: Mảng giá trị ["under-100", "100-300", "over-300"]

---

### 4.4. `filterByPrice(products, selectedPrices)`
```javascript
function filterByPrice(products, selectedPrices) {
    if (!selectedPrices.length) return products;

    return products.filter((p) => {
        return selectedPrices.some((priceRange) => {
            switch (priceRange) {
                case "under-100":
                    return p.price < 100000;
                case "100-300":
                    return p.price >= 100000 && p.price <= 300000;
                case "over-300":
                    return p.price > 300000;
                default:
                    return false;
            }
        });
    });
}
```
**Chức năng**: Lọc sản phẩm theo mức giá.

**Các mức giá**:
- `"under-100"`: Dưới 100,000đ
- `"100-300"`: Từ 100,000đ - 300,000đ
- `"over-300"`: Trên 300,000đ

**Đặc điểm**: Sử dụng `some()` nên sản phẩm khớp với MỘT TRONG NHỮNG mức giá được chọn sẽ được giữ lại.

---

### 4.5. `filterByKeyword(products, keyword)`
```javascript
function filterByKeyword(products, keyword) {
    if (!keyword) return products;

    return products.filter((p) => {
        return (
            p.name.toLowerCase().includes(keyword) ||
            p.category.toLowerCase().includes(keyword)
        );
    });
}
```
**Chức năng**: Lọc sản phẩm theo từ khóa tìm kiếm.

**Tìm kiếm theo**: Tên sản phẩm HOẶC category (không phân biệt hoa thường)

---

### 4.6. `getSearchKeyword()`
```javascript
function getSearchKeyword() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("keyword") || "").toLowerCase().trim();
}
```
**Chức năng**: Lấy từ khóa từ URL parameter.

**Kết quả**: Từ khóa đã lowercase và trim khoảng trắng

**Ví dụ**:
```
URL: product-list.html?keyword=mousse
→ getSearchKeyword() trả về "mousse"
```

---

### 4.7. `renderFilteredProducts(containerId)`
```javascript
function renderFilteredProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = "<p>Không có sản phẩm nào</p>";
        return;
    }
    container.innerHTML = "";

    // Lấy filter
    const selectedCats = getSelectedCategories();
    const selectedPrices = getSelectedPrices();
    const keyword = getSearchKeyword();

    // Lọc sản phẩm
    let filtered = [...products];

    if (keyword) {
        filtered = filterByKeyword(filtered, keyword);
    }

    if (selectedCats.length) {
        filtered = filterByCategories(filtered, selectedCats);
    }

    if (selectedPrices.length) {
        filtered = filterByPrice(filtered, selectedPrices);
    }

    // Nếu không có kết quả
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-search">
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Vui lòng thử từ khóa khác.</p>
            </div>
        `;
        return;
    }

    // Render sản phẩm
    filtered.forEach((p) => {
        container.innerHTML += `...`;
    });

    // Gán sự kiện
    const cartButtons = container.querySelectorAll(".hang");
    cartButtons.forEach((button) => {
        button.removeEventListener("click", handleCartClick);
        button.addEventListener("click", handleCartClick);
    });
}
```
**Chức năng**: Render sản phẩm dựa trên TẤT CẢ bộ lọc đang active.

**Luồng lọc**:
1. Từ khóa tìm kiếm (keyword)
2. Category (selectedCats)
3. Mức giá (selectedPrices)

---

### 4.8. `initFilters()`
```javascript
function initFilters() {
    const checkboxes = document.querySelectorAll(
        '.filter-card input[type="checkbox"]',
    );
    checkboxes.forEach((cb) => {
        cb.addEventListener("change", () => {
            renderFilteredProducts("all-products");
        });
    });
}
```
**Chức năng**: Khởi tạo sự kiện cho các checkbox filter.

**Luồng**: Khi checkbox thay đổi → Render lại sản phẩm

---

## 5. product-detail.js - Chi tiết sản phẩm

### 5.1. `tang()` và `giam()`
```javascript
function tang(){
    increaseQuantity('#quantity');
}
function giam(){
    decreaseQuantity('#quantity', 1);
}
```
**Chức năng**: Wrapper functions cho tăng/giảm số lượng ở trang chi tiết.

Gọi hàm từ `common.js` thay vì viết logic trực tiếp.

---

### 5.2. `themVaoGioHangTuDetail(redirectToCart)`
```javascript
function themVaoGioHangTuDetail(redirectToCart = false) {
    const quantity = getQuantity('#quantity');
    const product = products.find(p => p.id === id);

    if (!product) {
        console.error('Không tìm thấy sản phẩm!');
        return;
    }

    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart(cart);
    showNotification(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`, 'success');
    updateCartCount();

    if (redirectToCart) {
        setTimeout(() => {
            window.location.href = '../html/cart.html';
        }, 500);
    }
}
```
**Chức năng**: Thêm vào giỏ hàng từ trang chi tiết VỚI số lượng được chọn.

**Khác với `themVaoGioHang`**:
- Lấy số lượng từ UI (#quantity)
- Có thể chuyển hướng sang trang cart

**Tham số**:
- `redirectToCart` (boolean): true = chuyển sang cart sau khi thêm

---

### 5.3. `initProductDetailEvents()`
```javascript
function initProductDetailEvents() {
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            themVaoGioHangTuDetail(false);
        });
    }

    const buyBtn = document.querySelector('.buy');
    if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            themVaoGioHangTuDetail(true);
        });
    }

    const sizeButtons = document.querySelectorAll('.btn-size');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
```
**Chức năng**: Khởi tạo sự kiện cho trang chi tiết sản phẩm.

**Các sự kiện**:
1. Nút "Thêm vào giỏ hàng" → Thêm, giữ nguyên trang
2. Nút "Mua ngay" → Thêm, chuyển sang cart
3. Nút chọn size → Toggle class active

---

## 6. cart.js - Giỏ hàng

### 6.1. `updateQuantity(productId, newQuantity)`
```javascript
function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        if (newQuantity <= 0) {
            cart.splice(productIndex, 1);
        } else {
            cart[productIndex].quantity = newQuantity;
        }
        saveCart(cart);
        renderCart();
    }
}
```
**Chức năng**: Cập nhật số lượng sản phẩm trong giỏ hàng.

**Đặc điểm**:
- Nếu newQuantity ≤ 0 → Xóa sản phẩm
- Ngược lại → Cập nhật số lượng
- Tự động render lại UI

---

### 6.2. `removeFromCart(productId)`
```javascript
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
}
```
**Chức năng**: Xóa sản phẩm khỏi giỏ hàng.

---

### 6.3. `clearCart()`
```javascript
function clearCart() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        localStorage.removeItem('cart');
        renderCart();
        showNotification('Đã xóa toàn bộ giỏ hàng!', 'success');
    }
}
```
**Chức năng**: Xóa toàn bộ giỏ hàng (với confirm).

---

### 6.4. `renderCart()`
```javascript
function renderCart() {
    const cart = getCart();
    const cartBody = document.getElementById('cart-body');
    const totalAmountSpan = document.getElementById('total-amount');

    if (!cartBody) return;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <tr class="empty-cart-row">
                <td colspan="6" style="text-align: center; padding: 60px 20px;">
                    <div class="empty-cart">
                        <p style="font-size: 18px; color: #666;">🛒 Giỏ hàng của bạn đang trống!</p>
                        <a href="../html/trangchu.html" class="continue-shopping-btn">Tiếp tục mua sắm</a>
                    </div>
                </td>
            </tr>
        `;
        totalAmountSpan.textContent = '0';
        return;
    }

    let html = '';
    cart.forEach(item => {
        const totalPrice = item.price * item.quantity;
        html += `
            <tr data-product-id="${item.id}" class="cart-item">
                <td class="cart-product-image">
                    <img src="${item.image}" alt="${item.name}">
                </td>
                <td>${item.name}</td>
                <td>${formatPrice(item.price)}<u>đ</u></td>
                <td>
                    <div>
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>${formatPrice(totalPrice)}<u>đ</u></td>
                <td>
                    <button class="remove-btn" data-id="${item.id}">🗑️ Xóa</button>
                </td>
            </tr>
        `;
    });

    cartBody.innerHTML = html;
    const total = calculateTotal(cart);
    totalAmountSpan.textContent = formatPrice(total);

    attachCartEvents();
}
```
**Chức năng**: Render giỏ hàng ra table.

**Luồng hoạt động**:
1. Lấy giỏ hàng từ localStorage
2. Nếu rỗng → Hiển thị thông báo
3. Nếu có → Render từng sản phẩm
4. Tính tổng tiền
5. Gán sự kiện cho các nút

---

### 6.5. `attachCartEvents()`
```javascript
function attachCartEvents() {
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.removeEventListener('click', handleMinusClick);
        btn.addEventListener('click', handleMinusClick);
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.removeEventListener('click', handlePlusClick);
        btn.addEventListener('click', handlePlusClick);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.removeEventListener('change', handleQuantityChange);
        input.addEventListener('change', handleQuantityChange);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.removeEventListener('click', handleRemoveClick);
        btn.addEventListener('click', handleRemoveClick);
    });
}
```
**Chức năng**: Gán sự kiện cho các nút trong giỏ hàng.

**Sử dụng removeEventListener trước để tránh trùng lặp sự kiện.**

---

### 6.6. `handleMinusClick(event)`
```javascript
function handleMinusClick(event) {
    event.stopPropagation();
    const productId = parseInt(event.currentTarget.getAttribute('data-id'));
    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (product && product.quantity > 1) {
        updateQuantity(productId, product.quantity - 1);
        showNotification(`Đã giảm số lượng sản phẩm "${product.name}"`, 'info');
    } else if (product && product.quantity === 1) {
        if (confirm(`Bạn có muốn xóa sản phẩm "${product.name}" khỏi giỏ hàng?`)) {
            removeFromCart(productId);
            showNotification(`Đã xóa "${product.name}" khỏi giỏ hàng`, 'info');
        }
    }
}
```
**Chức năng**: Xử lý click nút minus (-).

**Luồng**:
- Nếu quantity > 1 → Giảm số lượng
- Nếu quantity = 1 → Hỏi có muốn xóa không

---

### 6.7. `handlePlusClick(event)`
```javascript
function handlePlusClick(event) {
    event.stopPropagation();
    const productId = parseInt(event.currentTarget.getAttribute('data-id'));
    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (product) {
        updateQuantity(productId, product.quantity + 1);
        showNotification(`Đã tăng số lượng sản phẩm "${product.name}"`, 'info');
    }
}
```
**Chức năng**: Xử lý click nút plus (+).

---

### 6.8. `handleQuantityChange(event)`
```javascript
function handleQuantityChange(event) {
    const productId = parseInt(event.currentTarget.getAttribute('data-id'));
    let newQuantity = parseInt(event.currentTarget.value);

    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
    }

    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    updateQuantity(productId, newQuantity);
    if (product) {
        showNotification(`Đã cập nhật số lượng "${product.name}" thành ${newQuantity}`, 'info');
    }
}
```
**Chức năng**: Xử lý khi nhập số lượng trực tiếp.

---

### 6.9. `handleRemoveClick(event)`
```javascript
function handleRemoveClick(event) {
    event.stopPropagation();
    const productId = parseInt(event.currentTarget.getAttribute('data-id'));
    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (product && confirm(`Bạn có chắc chắn muốn xóa "${product.name}" khỏi giỏ hàng?`)) {
        removeFromCart(productId);
        showNotification(`Đã xóa "${product.name}" khỏi giỏ hàng`, 'success');
    }
}
```
**Chức năng**: Xử lý click nút xóa sản phẩm.

---

### 6.10. `checkout()`
```javascript
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Giỏ hàng của bạn đang trống!', 'error');
        return;
    }

    const total = calculateTotal(cart);
    const totalFormatted = formatPrice(total);

    let productList = '';
    cart.forEach(item => {
        productList += `\n- ${item.name}: ${item.quantity} x ${formatPrice(item.price)}đ = ${formatPrice(item.price * item.quantity)}đ`;
    });

    const confirmMessage = `Xác nhận đơn hàng:\n${productList}\n\nTổng tiền: ${totalFormatted}đ\n\nBạn có muốn tiến hành thanh toán không?`;

    if (confirm(confirmMessage)) {
        alert(`✅ ĐẶT HÀNG THÀNH CÔNG!\n\nCảm ơn bạn đã đặt hàng!\nTổng tiền: ${totalFormatted}đ\n\nChúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.`);

        localStorage.removeItem('cart');
        renderCart();

        setTimeout(() => {
            window.location.href = '../html/trangchu.html';
        }, 2000);
    }
}
```
**Chức năng**: Xử lý thanh toán đơn hàng.

**Luồng hoạt động**:
1. Kiểm tra giỏ hàng có rỗng không
2. Hiển thị chi tiết đơn hàng
3. Xác nhận thanh toán
4. Xóa giỏ hàng
5. Chuyển về trang chủ sau 2s

**Lưu ý**: Đây là mockup, không kết nối backend thực tế.

---

### 6.11. `init()`
```javascript
function init() {
    renderCart();
    updateCartIconCount();

    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.removeEventListener('click', clearCart);
        clearCartBtn.addEventListener('click', clearCart);
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.removeEventListener('click', checkout);
        checkoutBtn.addEventListener('click', checkout);
    }

    const cartIcons = document.querySelectorAll('#gio');
    cartIcons.forEach(icon => {
        if (icon.src && icon.src.includes('cart.svg')) {
            icon.removeEventListener('click', handleCartIconClick);
            icon.addEventListener('click', handleCartIconClick);
        }
    });
}
```
**Chức năng**: Khởi tạo trang giỏ hàng.

**Gọi khi**:
```javascript
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

---

### 6.12. `handleCartIconClick(event)`
```javascript
function handleCartIconClick(event) {
    event.preventDefault();
    window.location.href = '../html/cart.html';
}
```
**Chức năng**: Xử lý click icon giỏ hàng (đang ở trang cart, không chuyển).

---

### 6.13. Storage Event Listener
```javascript
window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
        renderCart();
        updateCartIconCount();
    }
});
```
**Chức năng**: Đồng bộ giỏ hàng giữa các tab.

**Khi hoạt động**: Khi localStorage thay đổi ở tab khác → Render lại giỏ hàng ở tab hiện tại.

---

## Tóm tắt Flow giữa các hàm

### Flow thêm vào giỏ hàng:
```
User click nút "Thêm giỏ"
→ handleCartClick() / themVaoGioHangTuDetail()
→ themVaoGioHang()
→ getCart() (lấy giỏ hàng)
→ Kiểm tra sản phẩm đã có chưa
→ Thêm mới hoặc tăng số lượng
→ saveCart() (lưu vào localStorage)
→ showNotification() (hiển thị thông báo)
→ updateCartCount() (cập nhật badge)
```

### Flow lọc sản phẩm:
```
User checkbox thay đổi
→ initFilters() detect change
→ renderFilteredProducts()
→ getSelectedCategories() + getSelectedPrices() + getSearchKeyword()
→ filterByKeyword() → filterByCategories() → filterByPrice()
→ Render sản phẩm đã lọc
→ Gán sự kiện cho nút "Thêm giỏ"
```

### Flow giỏ hàng:
```
Trang cart load
→ init()
→ renderCart()
→ getCart() + render table
→ attachCartEvents() gán sự kiện
→ User click +/-/xóa
→ handleMinusClick() / handlePlusClick() / handleRemoveClick()
→ updateQuantity() / removeFromCart()
→ saveCart() + renderCart() lại
```

---

## Sơ đồ quan hệ giữa các hàm

```
┌─────────────────────────────────────────────────────────────┐
│                      common.js                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ formatPrice  │  │ getCart      │  │ saveCart     │      │
│  │ calculate... │  │ getTotalItems│  │ updateCart...│      │
│  │ showNotif... │  │ themVaoGio...│  │ increase...  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Được gọi bởi
                            ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────┐
│  home.js     │  │product-list  │  │product-detail │ │ cart  │
│              │  │              │  │               │ │       │
│renderProducts│  │renderFilt... │  │themVaoGio...  │ │render │
│handleCart..  │  │filterByCat.. │  │initProduct..  │ │update │
│              │  │filterByPrice │  │tang/giam      │ │check..│
└──────────────┘  └──────────────┘  └──────────────┘  └───────┘
```

---

© 2026 Quyn Bakery - Tài liệu kỹ thuật
