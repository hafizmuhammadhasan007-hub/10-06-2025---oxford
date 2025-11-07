// Enhanced chairs.js with image slider for quick view
document.addEventListener("DOMContentLoaded", () => {
  // init AOS
  if (window.AOS) AOS.init({ duration: 800, once: true });

  const productsRow = document.getElementById("productsRow");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const brandSelect = document.getElementById("brand");
  const sortSelect = document.getElementById("sort");
  const searchInput = document.getElementById("search");

  function filterAndSort() {
    const brand = (brandSelect?.value || "").toLowerCase();
    const sort = sortSelect?.value;
    const q = (searchInput?.value || "").trim().toLowerCase();

    // Filter
    productCards.forEach(card => {
      const parentCol = card.closest("[class*='col-']");
      const cardBrand = (card.dataset.brand || "").toLowerCase();
      const title = (card.querySelector("h4")?.textContent || "").toLowerCase();

      const matchesBrand = !brand || cardBrand === brand;
      const matchesQuery = title.includes(q);

      parentCol.style.display = (matchesBrand && matchesQuery) ? "block" : "none";
    });

    // Sort visible
    let visible = productCards.filter(c => c.closest("[class*='col-']").style.display !== "none");

    if (sort === "low-high") {
      visible.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
    } else if (sort === "high-low") {
      visible.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
    } else if (sort === "newest") {
      visible.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
    }

    visible.forEach(card => {
      const col = card.closest("[class*='col-']");
      productsRow.appendChild(col);
    });
  }

  brandSelect?.addEventListener("change", filterAndSort);
  sortSelect?.addEventListener("change", filterAndSort);
  searchInput?.addEventListener("input", debounce(filterAndSort, 200));

  function debounce(fn, delay) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Enhanced Quick View Modal with Image Slider
  document.querySelectorAll(".quick-view").forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.target.closest(".product-card");
      if (!card) return;

      const title = card.querySelector("h4").innerText;
      const price = card.querySelector(".price").innerText;
      const brand = card.dataset.brand;
      const date = card.dataset.date;
      const mainImg = card.querySelector(".main-img").src;
      const hoverImg = card.querySelector(".hover-img").src;
      const stars = card.querySelector(".stars").innerText;
      const tag = card.querySelector(".tag")?.innerText || "Available";
      
      // Determine status based on tag
      let status = "Available";
      let statusClass = "available";
      if (tag === "On Sale") {
        status = "On Sale";
        statusClass = "sale";
      } else if (tag === "New") {
        status = "New Arrival";
        statusClass = "new";
      } else if (tag === "Best Seller") {
        status = "Best Seller";
        statusClass = "bestseller";
      } else if (tag === "Featured") {
        status = "Featured";
        statusClass = "featured";
      }

      const modal = document.getElementById("quickViewModal");
      modal.querySelector(".modal-title").innerText = title;
      modal.querySelector(".modal-info").innerHTML = `
        <div class="product-details">
          <p><strong>Brand:</strong> <span class="brand-name">${brand.toUpperCase()}</span></p>
          <p><strong>Price:</strong> <span class="product-price">${price}</span></p>
          <p><strong>Status:</strong> <span class="status ${statusClass}">${status}</span></p>
          <p><strong>Rating:</strong> <span class="rating">${stars}</span></p>
          <p><strong>Available Since:</strong> ${new Date(date).toLocaleDateString()}</p>
          <p class="description">${getChairDescription(brand, title)}</p>
          <div class="product-features">
            <h6>Features:</h6>
            <ul>
              ${getChairFeatures(brand, title)}
            </ul>
          </div>
          <div class="mt-4 d-flex gap-2 flex-wrap">
            <button class="btn btn-warning btn-lg flex-fill add-to-cart-modal">
              <i class="fas fa-shopping-cart me-2"></i>Add to Cart
            </button>
            <button class="btn btn-outline-danger btn-lg flex-fill add-to-wishlist-modal">
              <i class="fas fa-heart me-2"></i>Add to Wishlist
            </button>
          </div>
        </div>
      `;

      // Update image slider
      const sliderContainer = modal.querySelector(".modal-img");
      sliderContainer.innerHTML = `
        <div class="image-slider">
          <div class="slider-main">
            <img src="${mainImg}" alt="${title}" class="img-fluid rounded active-slide">
            <img src="${hoverImg}" alt="${title} - Alternate View" class="img-fluid rounded">
          </div>
          <div class="slider-thumbnails mt-3">
            <button class="thumb-btn active" data-index="0">
              <img src="${mainImg}" alt="Main View" class="img-thumbnail">
            </button>
            <button class="thumb-btn" data-index="1">
              <img src="${hoverImg}" alt="Alternate View" class="img-thumbnail">
            </button>
          </div>
        </div>
      `;

      // Initialize slider functionality
      initImageSlider();
      
      // Add event listeners for modal buttons
      initModalButtons(card);
    });
  });

  function initImageSlider() {
    const thumbBtns = document.querySelectorAll('.thumb-btn');
    const mainImages = document.querySelectorAll('.slider-main img');
    
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        
        // Update active thumbnail
        thumbBtns.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active slide
        mainImages.forEach(img => img.classList.remove('active-slide'));
        mainImages[index].classList.add('active-slide');
      });
    });
  }

  function initModalButtons(card) {
    // Add to Cart functionality
    document.querySelector('.add-to-cart-modal')?.addEventListener('click', () => {
      showPopup("🛒 Chair added to cart!");
      // Close modal after adding to cart
      const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
      modal.hide();
    });

    // Add to Wishlist functionality
    document.querySelector('.add-to-wishlist-modal')?.addEventListener('click', () => {
      showPopup("❤️ Chair added to wishlist!");
    });
  }

  function getChairDescription(brand, title) {
    const descriptions = {
      'ikea': 'Modern and functional design perfect for contemporary living spaces.',
      'ashley': 'Luxurious comfort with premium materials and expert craftsmanship.',
      'lazboy': 'Ultimate relaxation with advanced comfort technology and durable construction.',
      'wayfair': 'Great value with stylish designs suitable for any home decor.',
      'potterybarn': 'Timeless elegance with high-quality materials and sophisticated design.'
    };
    return descriptions[brand] || 'Comfortable, stylish and durable chair perfect for your living space.';
  }

  function getChairFeatures(brand, title) {
    const features = {
      'ikea': ['Modern Scandinavian design', 'Easy to assemble', 'Durable materials', 'Space-saving'],
      'ashley': ['Premium upholstery', 'Solid wood frame', 'Plush cushioning', 'Easy maintenance'],
      'lazboy': ['Advanced reclining mechanism', 'Premium leather/fabric', 'Lumbar support', 'Durable construction'],
      'wayfair': ['Affordable pricing', 'Modern design', 'Easy to clean', 'Versatile styling'],
      'potterybarn': ['Handcrafted quality', 'Premium materials', 'Timeless design', 'Investment piece']
    };
    
    const brandFeatures = features[brand] || ['Comfortable seating', 'Durable construction', 'Easy maintenance', 'Modern design'];
    
    return brandFeatures.map(feature => `<li>${feature}</li>`).join('');
  }

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

  // Navbar scroll background
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".custom-navbar");
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
});