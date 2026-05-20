/**
 * Định dạng giá tiền theo định dạng Việt Nam
 * @param {*} price
 * @returns
 */
function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

/**
 * Lọc sản phẩm theo các category được chọn
 * @param {Array} products
 * @param {Array} selectedCategories - Ví dụ ["Bánh mousse", "Bánh mì"]
 * @returns {Array}
 */
function filterByCategories(products, selectedCategories) {
  if (!selectedCategories.length) return products;
  return products.filter(p => selectedCategories.includes(p.category));
}

// Biến lưu filter đang active
// let currentFilters = {
//   categories: []
// };

/**
 * Lấy tất cả sản phẩm đang được chọn từ các checkbox danh mục
 */
function getSelectedCategories() {
  const checkboxes = document.querySelectorAll('.filter-card input[type="checkbox"]');
  const selected = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      selected.push(cb.value);
    }
  });
  return selected;
}

/**
 * Render sản phẩm dựa trên filter hiện tại
 */
function renderFilteredProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Kiểm tra products có tồn tại không
  if (!products || products.length === 0) {
    container.innerHTML = "<p>Không có sản phẩm nào</p>";
    return;
  }
  container.innerHTML = "";

  // 1. Lấy danh mục đang chọn
  const selectedCats = getSelectedCategories();

  // 2. Lọc sản phẩm
  let filtered = [...products];
  if (selectedCats.length) {
    filtered = filterByCategories(filtered, selectedCats);
  }

  // 3. Render ra giao diện (giữ nguyên format cũ)
  filtered.forEach((p) => {
    container.innerHTML += `
      <a href="product.html?id=${p.id}" class="spham">
        <img src="${p.image}" alt="${p.name}">
        <div><h3>${p.name}</h3></div>
        <div class="tien">
          <div class="gia">
            <p class="text-gia">
              ${formatPrice(p.price)}<u>đ</u>
              ${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}đ</del>` : ""}
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

function initFilters() {
  const checkboxes = document.querySelectorAll('.filter-card input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      renderFilteredProducts("all-products");
    });
  });
}

// Khởi tạo sau khi DOM load
document.addEventListener("DOMContentLoaded", () => {
  renderFilteredProducts("all-products");
  initFilters();
});

renderFilteredProducts("all-products");
