/**
 * Định dạng giá tiền theo định dạng Việt Nam
 * @param {*} price 
 * @returns 
 */
function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

/**
 * Hàm render sản phẩm theo category vào container tương ứng
 * @param {*} category 
 * @param {*} containerId 
 */
function renderProducts(category, containerId) {
  const container = document.getElementById(containerId);

  // lọc sản phẩm theo category
  const filtered = products.filter((p) => p.category === category);

  // render sản phẩm ra UI
  // mỗi sản phẩm sẽ là một thẻ a, bên trong có hình ảnh, tên và giá tiền
  // nếu có oldPrice thì hiển thị giá cũ, nếu không thì chỉ hiển thị giá hiện tại
  // khi click vào sản phẩm sẽ chuyển đến trang product.html với query param là id của sản phẩm đó
  // forEach sẽ duyệt qua từng sản phẩm đã lọc được và thêm vào container dưới dạng HTML
  // innerHTML += sẽ thêm nội dung HTML mới vào cuối nội dung hiện tại của container, tạo thành một danh sách sản phẩm liên tiếp
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

// gọi hàm renderProducts để hiển thị sản phẩm theo category vào container tương ứng
// ở đây có 2 category là "mousse" và "bread salty", tương ứng với 2 container có id là "mousse" và "bread salty"
// khi trang home.html được tải, hàm renderProducts sẽ được gọi để hiển thị sản phẩm theo category vào container tương ứng
// "mousse" sẽ hiển thị sản phẩm có category là "mousse" vào container có id là "mousse"
renderProducts("mousse", "mousse");
// "bread salty" sẽ hiển thị sản phẩm có category là "bread salty" vào container có id là "bread salty"
renderProducts("bread salty", "bread salty");
