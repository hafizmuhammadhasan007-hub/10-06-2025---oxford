let currentPage = 1;
const productsPerPage = 8;
let currentFilters = {
    search: "",
    brand: "",
    category: "",
    type: "",
};
let currentSort = "popularity";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded - initializing filters");
    initializeEventListeners();
    initializeWishlist();
    initializeAddToCart();
    initializeCardClicks();
    updateProductsDisplay();
});

function initializeEventListeners() {
    console.log("Setting up event listeners");

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function (e) {
            console.log("Search input:", e.target.value);
            currentFilters.search = e.target.value.toLowerCase();
            currentPage = 1;
            updateProductsDisplay();
        });
    }

    const brandFilter = document.getElementById("brandFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const typeFilter = document.getElementById("typeFilter");

    if (brandFilter) {
        brandFilter.addEventListener("change", function (e) {
            console.log("Brand filter changed:", e.target.value);
            currentFilters.brand = e.target.value;
            currentPage = 1;
            updateProductsDisplay();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", function (e) {
            console.log("Category filter changed:", e.target.value);
            currentFilters.category = e.target.value;
            currentPage = 1;
            updateProductsDisplay();
        });
    }

    if (typeFilter) {
        typeFilter.addEventListener("change", function (e) {
            console.log("Type filter changed:", e.target.value);
            currentFilters.type = e.target.value;
            currentPage = 1;
            updateProductsDisplay();
        });
    }

    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", function (e) {
            console.log("Sort changed:", e.target.value);
            currentSort = e.target.value;
            updateProductsDisplay();
        });
    }
}

function initializeCardClicks() {
    document.addEventListener("click", function (e) {
        let card = e.target;
        while (card && !card.classList.contains("product-card")) {
            card = card.parentElement;
        }

        if (
            card &&
            !e.target.classList.contains("wishlist-btn") &&
            !e.target.classList.contains("add-to-cart-btn") &&
            !e.target.classList.contains("brand-tag")
        ) {
            const brand = card.getAttribute("data-brand");
            console.log("Card clicked - Brand:", brand);

            applyBrandFilter(brand);
        }

        if (e.target.classList.contains("brand-tag")) {
            const card = e.target.closest(".product-card");
            const brand = card.getAttribute("data-brand");
            console.log("Brand tag clicked - Brand:", brand);

            applyBrandFilter(brand);
        }
    });
}

function applyBrandFilter(brand) {
    console.log("Applying brand filter for:", brand);

    currentFilters.brand = brand;
    currentPage = 1;

    const brandFilter = document.getElementById("brandFilter");
    if (brandFilter) {
        brandFilter.value = brand;
    }

    showBrandFilterNotification(brand);

    updateProductsDisplay();
}

function showBrandFilterNotification(brand) {
    const existingNotification = document.querySelector(".brand-filter-notification");
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = "brand-filter-notification alert alert-info alert-dismissible fade show";
    notification.innerHTML = `
        Showing products from <strong>${getBrandDisplayName(brand)}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <button type="button" class="btn btn-sm btn-outline-dark ms-2" onclick="clearBrandFilter()">Show All Brands</button>
    `;

    notification.style.position = "fixed";
    notification.style.top = "80px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.zIndex = "1000";
    notification.style.minWidth = "300px";
    notification.style.textAlign = "center";

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getBrandDisplayName(brand) {
    const brandNames = {
        wayfair: "Wayfair",
        ikea: "IKEA",
        ashley: "Ashley",
        "la-z-boy": "La-Z-Boy",
        "pottery-barn": "Pottery Barn",
        "west-elm": "West Elm",
        "crate-barrel": "Crate & Barrel",
    };
    return brandNames[brand] || brand;
}

function clearBrandFilter() {
    console.log("Clearing brand filter");

    currentFilters.brand = "";
    currentPage = 1;

    const brandFilter = document.getElementById("brandFilter");
    if (brandFilter) {
        brandFilter.value = "";
    }

    const notification = document.querySelector(".brand-filter-notification");
    if (notification) {
        notification.remove();
    }

    updateProductsDisplay();
}

function initializeWishlist() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("wishlist-btn")) {
            const wishlistBtn = e.target;
            wishlistBtn.classList.toggle("active");
            wishlistBtn.innerHTML = wishlistBtn.classList.contains("active") ? "♥" : "♡";
            wishlistBtn.setAttribute(
                "aria-label",
                wishlistBtn.classList.contains("active") ? "Remove from wishlist" : "Add to wishlist"
            );

            wishlistBtn.style.transform = "scale(1.2)";
            setTimeout(() => {
                wishlistBtn.style.transform = "scale(1)";
            }, 200);

            e.stopPropagation();
        }
    });
}

function initializeAddToCart() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("add-to-cart-btn")) {
            const addToCartBtn = e.target;
            const originalText = addToCartBtn.textContent;

            addToCartBtn.textContent = "Added!";
            addToCartBtn.style.backgroundColor = "#28a745";
            addToCartBtn.style.borderColor = "#28a745";

            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.style.backgroundColor = "";
                addToCartBtn.style.borderColor = "";
            }, 2000);

            e.stopPropagation();
        }
    });
}

function updateProductsDisplay() {
    console.log("Updating display with filters:", currentFilters);

    const productCards = document.querySelectorAll(".product-card");
    const noProducts = document.getElementById("noProducts");
    let visibleCards = [];

    console.log("Total products found:", productCards.length);

    productCards.forEach((card) => {
        const title = card.querySelector(".product-title").textContent.toLowerCase();
        const description = card.querySelector(".product-description").textContent.toLowerCase();
        const brand = card.getAttribute("data-brand");
        const category = card.getAttribute("data-category");
        const types = card.getAttribute("data-type").split(",");

        const searchMatch =
            !currentFilters.search ||
            title.includes(currentFilters.search) ||
            description.includes(currentFilters.search);

        const brandMatch = !currentFilters.brand || brand === currentFilters.brand;

        const categoryMatch = !currentFilters.category || category === currentFilters.category;

        const typeMatch = !currentFilters.type || types.includes(currentFilters.type);

        if (searchMatch && brandMatch && categoryMatch && typeMatch) {
            card.classList.remove("hidden");
            card.style.display = "block";
            visibleCards.push(card);
        } else {
            card.classList.add("hidden");
            card.style.display = "none";
        }
    });

    if (visibleCards.length === 0) {
        noProducts.style.display = "block";
        document.getElementById("pagination").innerHTML = "";
        return;
    } else {
        noProducts.style.display = "none";
    }

    sortCards(visibleCards);

    applyPagination(visibleCards);
}

function sortCards(cards) {
    cards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute("data-price"));
        const priceB = parseFloat(b.getAttribute("data-price"));
        const ratingA = parseFloat(a.getAttribute("data-rating"));
        const ratingB = parseFloat(b.getAttribute("data-rating"));
        const popularityA = parseInt(a.getAttribute("data-popularity"));
        const popularityB = parseInt(b.getAttribute("data-popularity"));

        switch (currentSort) {
            case "price-low":
                return priceA - priceB;
            case "price-high":
                return priceB - priceA;
            case "rating":
                return ratingB - ratingA;
            case "newest":
                return popularityB - popularityA;
            case "popularity":
            default:
                return popularityB - popularityA;
        }
    });
}

function applyPagination(visibleCards) {
    const totalPages = Math.ceil(visibleCards.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedCards = visibleCards.slice(startIndex, endIndex);

    document.querySelectorAll(".product-card").forEach((card) => {
        if (!card.classList.contains("hidden")) {
            card.style.display = "none";
        }
    });

    paginatedCards.forEach((card) => {
        card.style.display = "block";
    });

    generatePagination(totalPages);
}

function generatePagination(totalPages) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>`;
    pagination.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement("li");
        pageLi.className = `page-item ${currentPage === i ? "active" : ""}`;
        pageLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>`;
        pagination.appendChild(pageLi);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>`;
    pagination.appendChild(nextLi);
}

function changePage(page) {
    currentPage = page;
    updateProductsDisplay();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearAllFilters() {
    console.log("Clearing all filters");

    currentFilters = {
        search: "",
        brand: "",
        category: "",
        type: "",
    };
    currentSort = "popularity";
    currentPage = 1;

    document.getElementById("searchInput").value = "";
    document.getElementById("brandFilter").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("typeFilter").value = "";
    document.getElementById("sortSelect").value = "popularity";

    const notification = document.querySelector(".brand-filter-notification");
    if (notification) {
        notification.remove();
    }

    updateProductsDisplay();
}