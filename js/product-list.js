// Hàm formatPrice đã được chuyển sang common.js

/**
 * Lọc sản phẩm theo các category được chọn
 * @param {Array} products
 * @param {Array} selectedCategories - Ví dụ ["Bánh mousse", "Bánh mì"]
 * @returns {Array}
 */
function filterByCategories(products, selectedCategories) {
  if (!selectedCategories.length) return products;
  return products.filter((p) => selectedCategories.includes(p.category));
}

// Biến lưu filter đang active
// let currentFilters = {
//   categories: []
// };

/**
 * Lấy tất cả sản phẩm đang được chọn từ các checkbox danh mục
 */
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

/**
 * Lấy tất cả mức giá đang được chọn từ các checkbox giá tiền
 * @returns {Array} Mảng các giá tiền được chọn, ví dụ ["under-100k", "100k-300k"]
 */
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

/**
 * Lọc sản phẩm theo các mức giá được chọn
 * @param {Array} products
 * @param {Array} selectedPrices - Ví dụ ["under-100k", "100k-300k"]
 * @returns {Array}
 */
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

/**
 * Lọc sản phẩm theo từ khóa tìm kiếm
 * @param {Array} products
 * @param {string} keyword
 * @returns {Array}
 */
function filterByKeyword(products, keyword) {
  if (!keyword) return products;

  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    );
  });
}

/**
 * Hàm lấy từ khóa tìm kiếm từ URL
 * @returns {string} Từ khóa tìm kiếm
 */
function getSearchKeyword() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("keyword") || "").toLowerCase().trim();
}

/**
 * Render sản phẩm dựa trên filter hiện tại
 */
function renderFilteredProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = "<p>Không có sản phẩm nào</p>";
    return;
  }
  container.innerHTML = "";

  // 1. Lấy danh mục đang chọn
  const selectedCats = getSelectedCategories();
  // 2. Lấy giá đang chọn
  const selectedPrices = getSelectedPrices();
  // 3. Lấy từ khóa tìm kiếm
  const keyword = getSearchKeyword();

  // 3. Lọc sản phẩm
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

  if (filtered.length === 0) {
    container.innerHTML = `
    <div class="empty-search">
      <h3>Không tìm thấy sản phẩm</h3>
      <p>Vui lòng thử từ khóa khác.</p>
    </div>
  `;
    return;
  }
  // 4. Render ra giao diện
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
              ${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}đ</del>` : ""}
            </p>
          </div>
          <button class="hang" data-product-id="${p.id}">
                    <img src="../assets/image/shopping-cart.svg" alt="Thêm vào giỏ">
          </button>
        </div>
      </a>
    `;
  });

  const cartButtons = container.querySelectorAll(".hang");
  cartButtons.forEach((button) => {
    button.removeEventListener("click", handleCartClick);
    button.addEventListener("click", handleCartClick);
  });
}

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

// Khởi tạo sau khi DOM load
document.addEventListener("DOMContentLoaded", () => {
  renderFilteredProducts("all-products");
  initFilters();
  updateCartCount();
});

// Sự kiện click vào icon giỏ hàng
document.querySelectorAll("#gio").forEach((icon) => {
  if (icon.src && icon.src.includes("cart.svg")) {
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../html/cart.html";
    });
  }
});

renderFilteredProducts("all-products");
