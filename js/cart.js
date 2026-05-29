/**
 * cart.js - Xử lý chức năng giỏ hàng
 * Các hàm formatPrice, getCart, saveCart, calculateTotal, showNotification, updateCartIconCount
 * đã được chuyển sang common.js
 */

// Hàm cập nhật số lượng sản phẩm
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

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
}

// Hàm xóa toàn bộ giỏ hàng
function clearCart() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        localStorage.removeItem('cart');
        renderCart();
        showNotification('Đã xóa toàn bộ giỏ hàng!', 'success');
    }
}

// Hàm render giỏ hàng ra table
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
                    <img src="${item.image}" alt="${item.name}" width="80" height="80" style="object-fit: cover;">
                </td>
                <td class="cart-product-name">${item.name}</td>
                <td class="cart-product-price">${formatPrice(item.price)}<u>đ</u></td>
                <td class="cart-product-quantity">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td class="cart-product-total">${formatPrice(totalPrice)}<u>đ</u></td>
                <td class="cart-product-action">
                    <button class="remove-btn" data-id="${item.id}">
                        🗑️ Xóa
                    </button>
                </td>
            </tr>
        `;
    });

    cartBody.innerHTML = html;

    const total = calculateTotal(cart);
    totalAmountSpan.textContent = formatPrice(total);

    attachCartEvents();
}

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

function handleCartIconClick(event) {
    event.preventDefault();
    window.location.href = '../html/cart.html';
}

window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
        renderCart();
        updateCartIconCount();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}