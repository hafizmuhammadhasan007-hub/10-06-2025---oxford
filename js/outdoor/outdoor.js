// outdoor.js
document.addEventListener("DOMContentLoaded", function() {
  // Initialize AOS
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true
    });
  }

  // Filter and Sort Functionality
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

    // Reorder products in DOM
    visibleProducts.forEach(p => {
      container.appendChild(p.parentElement);
    });
  }

  // Event Listeners for Filter/Sort
  brandFilter.addEventListener("change", filterAndSort);
  sortFilter.addEventListener("change", filterAndSort);
  searchInput.addEventListener("input", filterAndSort);

  // Quick View Modal Functionality
  function openQuickView(card) {
    const title = card.querySelector("h4").textContent;
    const price = card.querySelector(".price").textContent;
    const brand = card.dataset.brand;
    const date = card.dataset.date;
    const stars = card.querySelector(".stars").textContent;
    const mainImg = card.querySelector(".main-img").src;
    const hoverImg = card.querySelector(".hover-img").src;
    
    // Get tag status
    const tagElement = card.querySelector(".tag");
    let status = "Available";
    let statusClass = "available";
    
    if (tagElement) {
      const tagText = tagElement.textContent.toLowerCase();
      status = tagElement.textContent;
      
      if (tagText.includes("sale")) {
        statusClass = "sale";
      } else if (tagText.includes("new")) {
        statusClass = "new";
      } else if (tagText.includes("best")) {
        statusClass = "bestseller";
      } else if (tagText.includes("featured")) {
        statusClass = "featured";
      }
    }

    // Update Modal Content
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBrand").textContent = brand.toUpperCase();
    document.getElementById("modalPrice").textContent = price;
    document.getElementById("modalStatus").textContent = status;
    document.getElementById("modalStatus").className = "status " + statusClass;
    document.getElementById("modalRating").textContent = stars;
    document.getElementById("modalDate").textContent = new Date(date).toLocaleDateString();
    
    // Set description based on brand
    const description = getOutdoorDescription(brand, title);
    document.getElementById("modalDescription").textContent = description;
    
    // Set features
    const features = getOutdoorFeatures(brand, title);
    document.getElementById("modalFeatures").innerHTML = features;
    
    // Update images
    document.getElementById("modalMainImg").src = mainImg;
    document.getElementById("modalHoverImg").src = hoverImg;
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll(".thumb-btn img");
    thumbnails[0].src = mainImg;
    thumbnails[1].src = hoverImg;
    
    // Reset slider to first image
    switchImage(0);
  }

  // Image Slider Functionality
  function switchImage(index) {
    const slides = document.querySelectorAll(".slider-main img");
    const thumbs = document.querySelectorAll(".thumb-btn");
    
    slides.forEach((slide, i) => {
      slide.classList.toggle("active-slide", i === index);
    });
    
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  // Thumbnail click event
  document.addEventListener("click", function(e) {
    if (e.target.closest(".thumb-btn")) {
      const btn = e.target.closest(".thumb-btn");
      const index = parseInt(btn.dataset.index);
      switchImage(index);
    }
  });

  // Quick View button click event
  document.addEventListener("click", function(e) {
    if (e.target.closest(".quick-view")) {
      const card = e.target.closest(".product-card");
      openQuickView(card);
    }
  });

  // Add to Cart functionality
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      showPopup("🛒 Outdoor furniture added to cart!");
    });
  });

  // Add to Wishlist functionality
  document.querySelectorAll(".add-to-wishlist").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      showPopup("❤️ Outdoor furniture added to wishlist!");
    });
  });

  // Modal Add to Cart
  document.addEventListener("click", function(e) {
    if (e.target.closest(".add-to-cart-modal")) {
      showPopup("🛒 Outdoor furniture added to cart!");
    }
  });

  // Modal Add to Wishlist
  document.addEventListener("click", function(e) {
    if (e.target.closest(".add-to-wishlist-modal")) {
      showPopup("❤️ Outdoor furniture added to wishlist!");
    }
  });

  // Popup Function
  function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.classList.add("show");
    }, 100);
    
    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => {
        popup.remove();
      }, 300);
    }, 2000);
  }

  // Navbar Scroll Effect
  window.addEventListener("scroll", function() {
    const navbar = document.querySelector(".custom-navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Helper functions for modal content
  function getOutdoorDescription(brand, title) {
    const descriptions = {
      'ikea': 'Weather-resistant outdoor furniture perfect for patios and gardens. Easy to maintain and durable.',
      'ashley': 'Luxurious outdoor furniture with premium weather-resistant materials for elegant outdoor spaces.',
      'lazboy': 'Comfort-focused outdoor furniture designed for relaxation in your garden or patio.',
      'wayfair': 'Great value outdoor furniture suitable for any outdoor space with durable construction.',
      'potterybarn': 'Timeless outdoor furniture designs with high-quality weather-resistant materials.'
    };
    return descriptions[brand] || 'Durable, weather-resistant and stylish outdoor furniture perfect for your space.';
  }

  function getOutdoorFeatures(brand, title) {
    const features = {
      'ikea': ['Weather-resistant materials', 'Easy to clean', 'Durable construction', 'Space-saving', 'Eco-friendly'],
      'ashley': ['Premium weather-proof materials', 'Elegant design', 'Sturdy build', 'Easy maintenance', 'Luxury finish'],
      'lazboy': ['Comfort-focused design', 'Weather-resistant', 'Durable construction', 'Stylish appeal', 'Quality craftsmanship'],
      'wayfair': ['Affordable pricing', 'Weather-proof design', 'Easy assembly', 'Versatile styling', 'Great value'],
      'potterybarn': ['Handcrafted quality', 'Premium weather-resistant materials', 'Timeless design', 'Investment piece', 'Elegant outdoor centerpiece']
    };
    
    const brandFeatures = features[brand] || ['Weather-resistant', 'Durable construction', 'Comfortable design', 'Easy maintenance', 'Quality materials'];
    
    return brandFeatures.map(feature => `<li>${feature}</li>`).join('');
  }
});