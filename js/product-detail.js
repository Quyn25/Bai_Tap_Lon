function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

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
  sluognhap.value =parseInt(sluognhap.value) +1;
}