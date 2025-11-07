document.addEventListener("DOMContentLoaded", () => {
  const products = document.querySelectorAll(".product-card");
  const brandFilter = document.getElementById("brand");
  const sortFilter = document.getElementById("sort");
  const searchInput = document.getElementById("search");
  const container = document.querySelector(".products .row");

  function filterAndSort() {
    let brand = brandFilter.value.toLowerCase();
    let sort = sortFilter.value;
    let search = searchInput.value.toLowerCase();

    let productsArr = Array.from(products);

    // Filter
    productsArr.forEach(p => {
      let productBrand = p.dataset.brand;
      let productName = p.querySelector("h4").textContent.toLowerCase();
      if ((brand === "" || productBrand === brand) && productName.includes(search)) {
        p.parentElement.style.display = "block";
      } else {
        p.parentElement.style.display = "none";
      }
    });

    // Sort visible products
    let visibleProducts = productsArr.filter(p => p.parentElement.style.display !== "none");

    if (sort === "low-high") {
      visibleProducts.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
    } else if (sort === "high-low") {
      visibleProducts.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
    } else if (sort === "newest") {
      visibleProducts.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
    }

    visibleProducts.forEach(p => container.appendChild(p.parentElement));
  }

  brandFilter.addEventListener("change", filterAndSort);
  sortFilter.addEventListener("change", filterAndSort);
  searchInput.addEventListener("input", filterAndSort);

  // Popups and working links
  function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup center";
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add("show"), 100);
    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => popup.remove(), 300);
    }, 2000);
  }

  // Add to cart functionality
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showPopup("🛒 Item added to cart!");
    });
  });

  // Add to wishlist functionality
  document.querySelectorAll(".add-to-wishlist").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showPopup("❤️ Added to wishlist!");
    });
  });

  // Make view details links work
  document.querySelectorAll(".details").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // You can redirect to actual product detail page here
      window.location.href = "product-detail.html";
    });
  });
});





function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup center";
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 100);
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 2000);
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => showPopup("🛒 Item added to cart!"));
});
document.querySelectorAll(".add-to-wishlist").forEach(btn => {
  btn.addEventListener("click", () => showPopup("❤️ Added to wishlist!"));
});
