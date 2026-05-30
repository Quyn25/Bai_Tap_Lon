/**
 * common.js - Các hàm dùng chung cho toàn bộ ứng dụng
 */

/**
 * Hàm định dạng giá tiền theo định dạng Việt Nam
 * @param {number} price - Giá tiền cần định dạng
 * @returns {string} Giá đã định dạng
 */
function formatPrice(price) {
    return price.toLocaleString("vi-VN");
}

/**
 * Hàm lấy giỏ hàng từ localStorage
 * @returns {Array} Mảng các sản phẩm trong giỏ hàng
 */
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Hàm lưu giỏ hàng vào localStorage
 * @param {Array} cart - Mảng các sản phẩm trong giỏ hàng
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Kích hoạt sự kiện storage để đồng bộ các tab
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(cart)
    }));
}

/**
 * Hàm tính tổng tiền giỏ hàng
 * @param {Array} cart - Mảng các sản phẩm trong giỏ hàng
 * @returns {number} Tổng tiền
 */
function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Hàm tính tổng số lượng sản phẩm trong giỏ hàng
 * @param {Array} cart - Mảng các sản phẩm trong giỏ hàng
 * @returns {number} Tổng số lượng sản phẩm
 */
function getTotalItems(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Hàm cập nhật số lượng hiển thị trên icon giỏ hàng
 * Hoạt động cho cả 2 cấu trúc HTML: có #cart-icon hoặc #gio trực tiếp
 */
function updateCartCount() {
    const cart = getCart();
    const totalItems = getTotalItems(cart);

    // Ưu tiên tìm icon trong #cart-icon (trang chủ)
    let container = document.getElementById('cart-icon');
    let targetImg = container ? container.querySelector('#gio[src*="cart.svg"]') : null;

    // Nếu không tìm thấy, tìm #gio trực tiếp (các trang khác)
    if (!targetImg) {
        const cartIcons = document.querySelectorAll('#gio[src*="cart.svg"]');
        if (cartIcons.length > 0) {
            targetImg = cartIcons[0];
            container = targetImg.parentElement;
        }
    }

    if (!targetImg || !container) return;

    // Tìm hoặc tạo badge
    let badge = container.querySelector('.cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        container.appendChild(badge);
    }

    container.style.position = 'relative';

    // Hiển thị số lượng
    badge.textContent = totalItems > 99 ? '9+' : totalItems;
}

/**
 * Hàm cũ để tương thích - gọi updateCartCount
 */
function updateCartIconCount() {
    updateCartCount();
}

/**
 * Hàm hiển thị thông báo
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, error, info)
 */
function showNotification(message, type = 'success') {
    // Kiểm tra xem đã có notification element chưa
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

/**
 * Hàm thêm sản phẩm vào giỏ hàng
 * @param {number} productId - ID của sản phẩm
 * @param {Event} event - Event object (optional)
 */
function themVaoGioHang(productId, event) {
    // Ngăn chặn sự kiện click lan ra ngoài
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    // Tìm sản phẩm theo id
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error('Không tìm thấy sản phẩm!');
        return;
    }

    // Lấy giỏ hàng từ localStorage
    let cart = getCart();

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex !== -1) {
        // Nếu đã có, tăng số lượng lên 1
        cart[existingProductIndex].quantity += 1;
    } else {
        // Nếu chưa có, thêm mới với số lượng = 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Lưu lại vào localStorage
    saveCart(cart);

    // Hiển thị thông báo
    showNotification(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');

    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount();
}

// Sự kiện khi click vào icon giỏ hàng sẽ chuyển đến trang cart.html
// document.getElementById("cart-icon").addEventListener("click", function () {
//     window.location.href = "../html/cart.html";
// });

