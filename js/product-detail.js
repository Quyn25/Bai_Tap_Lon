// Hàm formatPrice đã được chuyển sang common.js

// lấy id từ URL
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

// tìm sản phẩm
const product = products.find(p => p.id === id);

// render ra UI
if (product) {
  document.getElementById("product-image").src = product.image;
  document.getElementById("product-name").innerText = product.name;
  document.getElementById("product-category").innerText = product.category;
  document.getElementById("product-price").innerText = formatPrice(product.price) + "đ";
  document.getElementById("product-old-price").innerText = product.oldPrice
    ? formatPrice(product.oldPrice) + "đ"
    : "";
    formatPrice(product.price) + "đ";
  document.getElementById("product-desc").innerText =
    product.desc || "Không có mô tả";
} else {
  document.body.innerHTML = "<h2>Không tìm thấy sản phẩm</h2>";
} 

//tăng giảm số lượng
//tăng giảm số lượng - sử dụng hàm từ common.js
function tang(){
  increaseQuantity('#quantity');
}
function giam(){
  decreaseQuantity('#quantity', 1);
}
//kích thước 
const btn = document.querySelectorAll(".btn-size");
//lưu ds btn (tìm kiếm tất cả các phần tử trên web có class là btn-size)
btn.forEach(button =>{
//dùng vòng lặp forEach 
    button.addEventListener("click",function() {
//khi nào bấm click thì thực hiện function
      document.querySelector(".btn-size.active").classList.remove("active");
      //khi click thì xóa active ở nút cũ và trở lại bth
      this.classList.add("active");
   //hiển thị giá new
 //thiếu cộng thêm giá dịch vụ vào giá gốc
    });
});


//sản phẩm liên quan


function renderProducts(category, containerId, currentProductId) {
  const container = document.getElementById(containerId);
  
  // lọc sản phẩm theo category và khác id đang xem (currentProductId)
  const filtered = products.filter((p) => p.category === category && p.id !== currentProductId);
  //xóa sau khi chọn sản phẩm khác
  container.innerHTML = '';

  
  // duyệt qua các sản phẩm đã lọc 
  filtered.forEach((p) => {
    container.innerHTML += `
        <a href="product.html?id=${p.id}" class="spham">
        <img src="${p.image}" alt="${p.name}">
        

        <div>
          <h3>${p.name}</h3>
        </div>

        <div class="tien">
          <div class="gia">
            <p class="text-gia">
              ${formatPrice(p.price)}<u>đ</u>

              ${
                p.oldPrice
                  ? `
                <del>${formatPrice(p.oldPrice)}đ</del>
              `
                  : ""
              }
            </p>
          </div>

          <button class="hang">
            <img src="../assets/image/shopping-cart.svg">
          </button>
        </div>
        </a>
    `;
  });
}
//hiện lên màn hình sp liên quan 
renderProducts(product.category,'sp-lquan',product.id);


/**
 * Xử lý sự kiện click vào button thêm giỏ hàng
 * @param {*} event
 */
function handleCartClick(event) {
  event.stopPropagation();
  event.preventDefault();

  // Lấy id sản phẩm từ button
  const productId = parseInt(
    event.currentTarget.getAttribute("data-product-id"),
  );

  // Gọi hàm thêm vào giỏ hàng
  themVaoGioHang(productId, event);
}

// Cập nhật số lượng giỏ hàng khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

/**
 * Xử lý thêm vào giỏ hàng từ trang chi tiết sản phẩm
 * @param {boolean} redirectToCart - Có chuyển hướng sang trang cart không
 */
function themVaoGioHangTuDetail(redirectToCart = false) {
  // Lấy số lượng từ UI bằng hàm chia sẻ
  const quantity = getQuantity('#quantity');

  // Tìm sản phẩm theo id
  const product = products.find(p => p.id === id);

  if (!product) {
    console.error('Không tìm thấy sản phẩm!');
    return;
  }

  // Lấy giỏ hàng từ localStorage
  let cart = getCart();

  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const existingProductIndex = cart.findIndex(item => item.id === id);

  if (existingProductIndex !== -1) {
    // Nếu đã có, tăng số lượng theo số lượng được chọn
    cart[existingProductIndex].quantity += quantity;
  } else {
    // Nếu chưa có, thêm mới với số lượng được chọn
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  // Lưu lại vào localStorage
  saveCart(cart);

  // Hiển thị thông báo
  showNotification(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`, 'success');

  // Cập nhật số lượng hiển thị trên icon giỏ hàng
  updateCartCount();

  // Nếu là nút "Mua ngay", chuyển hướng sang trang cart
  if (redirectToCart) {
    setTimeout(() => {
      window.location.href = '../html/cart.html';
    }, 500);
  }
}

/**
 * Gán sự kiện cho các button trong trang product detail
 */
function initProductDetailEvents() {
  // Nút "Thêm vào giỏ hàng"
  const addToCartBtn = document.querySelector('.add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      themVaoGioHangTuDetail(false);
    });
  }

  // Nút "Mua ngay"
  const buyBtn = document.querySelector('.buy');
  if (buyBtn) {
    buyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      themVaoGioHangTuDetail(true);
    });
  }

  // Xử lý chọn kích thước (size)
  const sizeButtons = document.querySelectorAll('.btn-size');
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Xóa class active khỏi tất cả các nút
      sizeButtons.forEach(b => b.classList.remove('active'));
      // Thêm class active cho nút được click
      this.classList.add('active');
    });
  });
}

// Khởi tạo sự kiện khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
  initProductDetailEvents();
});

// Sự kiện click vào icon giỏ hàng
document.querySelectorAll('#gio').forEach(icon => {
  if (icon.src && icon.src.includes('cart.svg')) {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../html/cart.html';
    });
  }
});

