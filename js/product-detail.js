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
function tang(){
  const sluognhap= document.getElementById("quantity");
  let gtri= parseInt(sluognhap.innerText);
  sluognhap.innerText= gtri +1;
}
function giam(){
  const sluognhap= document.getElementById("quantity");
  let gtri = parseInt(sluognhap.innerText);
  //điều kiện
  if (gtri>1){
    sluognhap.innerText = gtri - 1;
  }
}
<<<<<<< HEAD
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

=======

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
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
>>>>>>> ac50b09220f29c46ce994ae30aa478899eeaae78

