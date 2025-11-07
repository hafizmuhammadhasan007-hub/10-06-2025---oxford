document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showNotification('Please login to view your cart', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Load cart items
    loadCartItems();
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            showNotification('Thank you for your order! Your items will be shipped soon.', 'success');
            setTimeout(() => {
                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            }, 2000);
        });
    }
});

function loadCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartContainer) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContainer.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContainer.style.display = 'block';
    
    // Clear previous items
    cartContainer.innerHTML = '';
    
    let total = 0;
    
    // Fetch product details
    fetch('js/products.json')
        .then(response => response.json())
        .then(products => {
            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    const itemTotal = product.price * cartItem.quantity;
                    total += itemTotal;
                    
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';
                    cartItemElement.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="cart-item-details">
                            <h3>${product.name}</h3>
                            <p class="cart-item-price">PKR ${product.price.toLocaleString()} x ${cartItem.quantity}</p>
                            <p>Subtotal: PKR ${itemTotal.toLocaleString()}</p>
                            <button class="remove-item" data-id="${product.id}">Remove</button>
                        </div>
                    `;
                    cartContainer.appendChild(cartItemElement);
                }
            });
            
            // Update total
            cartTotal.textContent = `PKR ${total.toLocaleString()}`;
            
            // Add event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.remove-item');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    removeFromCart(productId);
                });
            });
        })
        .catch(error => {
            console.error('Error loading cart items:', error);
            showNotification('Error loading cart items', 'error');
        });
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the product to get its name for the notification
    fetch('js/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            const productName = product ? product.name : 'Item';
            
            // Remove item from cart
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show notification
            showNotification(`${productName} removed from cart`, 'info');
            
            // Reload cart items
            loadCartItems();
            updateCartCount();
        })
        .catch(error => {
            console.error('Error finding product:', error);
            // Remove item from cart even if we can't find the product details
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            showNotification('Item removed from cart', 'info');
            loadCartItems();
            updateCartCount();
        });
}

// Notification function
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="notification-content">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(notification);
    
    // Trigger reflow
    void notification.offsetWidth;
    
    // Show notification
    notification.classList.add('show');
    
    // Close button event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}