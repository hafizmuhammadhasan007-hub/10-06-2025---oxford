document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load wishlist items
    loadWishlistItems();
});

function loadWishlistItems() {
    const wishlistContainer = document.getElementById('wishlist-items');
    const emptyWishlist = document.getElementById('empty-wishlist');
    
    if (!wishlistContainer) return;
    
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        emptyWishlist.style.display = 'block';
        wishlistContainer.style.display = 'none';
        return;
    }
    
    emptyWishlist.style.display = 'none';
    wishlistContainer.style.display = 'block';
    
    // Clear previous items
    wishlistContainer.innerHTML = '';
    
    // Fetch product details
    fetch('js/products.json')
        .then(response => response.json())
        .then(products => {
            wishlist.forEach(productId => {
                const product = products.find(p => p.id === productId);
                if (product) {
                    const wishlistItemElement = document.createElement('div');
                    wishlistItemElement.className = 'wishlist-item';
                    wishlistItemElement.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="wishlist-item-details">
                            <h3>${product.name}</h3>
                            <p class="wishlist-item-price">PKR ${product.price.toLocaleString()}</p>
                            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                            <button class="remove-item" data-id="${product.id}">Remove</button>
                        </div>
                    `;
                    wishlistContainer.appendChild(wishlistItemElement);
                }
            });
            
            // Add event listeners to buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    addToCart(productId);
                });
            });
            
            const removeButtons = document.querySelectorAll('.remove-item');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    removeFromWishlist(productId);
                });
            });
        })
        .catch(error => console.error('Error loading wishlist items:', error));
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Remove item from wishlist
    wishlist = wishlist.filter(id => id !== productId);
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Reload wishlist items
    loadWishlistItems();
    updateWishlistCount();
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    alert('Product added to cart!');
}