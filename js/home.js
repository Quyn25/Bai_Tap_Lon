// Các hàm formatPrice, themVaoGioHang, updateCartCount đã được chuyển sang common.js

/**
 * Hàm render sản phẩm theo category vào container tương ứng (đã sửa)
 * @param {*} category
 * @param {*} containerId
 */
function renderProducts(category, containerId) {
    const container = document.getElementById(containerId);
    
    // Xóa nội dung cũ trước khi render mới (tránh bị trùng lặp)
    container.innerHTML = '';
    
    // lọc sản phẩm theo category
    const filtered = products.filter((p) => p.category === category);
    
    // render sản phẩm ra UI
    filtered.forEach((p) => {
        container.innerHTML += `
        <div class="spham" data-product-id="${p.id}">
            <a href="product.html?id=${p.id}" class="spham-link">
                <img src="${p.image}" alt="${p.name}">
            </a>
            
            <div>
                <h3>${p.name}</h3>
            </div>
            
            <div class="tien">
                <div class="gia">
                    <p class="text-gia">
                        ${formatPrice(p.price)}<u>đ</u>
                        ${
                            p.oldPrice
                            ? `<del>${formatPrice(p.oldPrice)}đ</del>`
                            : ""
                        }
                    </p>
                </div>
                
                <button class="hang" data-product-id="${p.id}">
                    <img src="../assets/image/shopping-cart.svg" alt="Thêm vào giỏ">
                </button>
            </div>
        </div>
        `;
    });
    
    // Sau khi render xong, gán sự kiện click cho tất cả các button "hang"
    const cartButtons = container.querySelectorAll('.hang');
    cartButtons.forEach(button => {
        button.removeEventListener('click', handleCartClick);
        button.addEventListener('click', handleCartClick);
    });
}

/**
 * Xử lý sự kiện click vào button thêm giỏ hàng
 * @param {*} event 
 */
function handleCartClick(event) {
    event.stopPropagation();
    event.preventDefault();
    
    // Lấy id sản phẩm từ button
    const productId = parseInt(event.currentTarget.getAttribute('data-product-id'));
    
    // Gọi hàm thêm vào giỏ hàng
    themVaoGioHang(productId, event);
}

// Cập nhật số lượng giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// Sự kiện khi click vào icon giỏ hàng sẽ chuyển đến trang cart.html
document.querySelectorAll('#gio').forEach(icon => {
  if (icon.src && icon.src.includes('cart.svg')) {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../html/cart.html';
    });
  }
});

// gọi hàm renderProducts để hiển thị sản phẩm
renderProducts("mousse", "mousse");
renderProducts("bread salty", "bread salty");
renderProducts("cake", "cake");
renderProducts("bread", "bread");
renderProducts("baked goods", "baked goods");