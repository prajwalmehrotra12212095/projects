document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuItemsContainer = document.getElementById('menu-items');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeButtons = document.querySelectorAll('.close');
    const themeToggle = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const orderTotalElement = document.getElementById('order-total');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    const orderIdElement = document.getElementById('order-id');

    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize the app
    function init() {
        updateCartCount();
        setupEventListeners();
        checkThemePreference();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Cart button click
        cartBtn.addEventListener('click', openCartModal);

        // Close modal buttons
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });

        // Proceed to checkout button
        checkoutBtn.addEventListener('click', openCheckoutModal);

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Search functionality
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        // Checkout form submission
        checkoutForm.addEventListener('submit', handleCheckout);

        // Close confirmation modal
        closeConfirmationBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
            if (event.target === checkoutModal) {
                checkoutModal.style.display = 'none';
            }
            if (event.target === confirmationModal) {
                confirmationModal.style.display = 'none';
            }
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const itemName = this.getAttribute('data-name');
                const itemPrice = parseFloat(this.getAttribute('data-price'));
                addToCart(itemId, itemName, itemPrice);
            });
        });
    }

    // Add item to cart
    function addToCart(itemId, itemName, itemPrice) {
        const existingItem = cart.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }

        updateCart();
        showAddedToCartMessage(itemName);
    }

    // Show "added to cart" message
    function showAddedToCartMessage(itemName) {
        const message = document.createElement('div');
        message.classList.add('cart-message');
        message.textContent = `${itemName} added to cart!`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }

    // Update cart
    function updateCart() {
        updateCartCount();
        renderCartItems();
        saveCartToLocalStorage();
    }

    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = count;
    }

    // Render cart items
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p id="empty-cart-message">Your cart is empty</p>';
            cartTotalElement.textContent = '0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });

        // Calculate and display total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
        orderTotalElement.textContent = total.toFixed(2);

        // Add event listeners to quantity buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                updateCartItemQuantity(itemId, 1);
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                updateCartItemQuantity(itemId, -1);
            });
        });
    }

    // Update cart item quantity
    function updateCartItemQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        updateCart();
    }

    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Open cart modal
    function openCartModal() {
        renderCartItems();
        cartModal.style.display = 'block';
    }

    // Open checkout modal
    function openCheckoutModal() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to proceed to checkout.');
            return;
        }
        checkoutModal.style.display = 'block';
        cartModal.style.display = 'none';
    }

    // Close modal
    function closeModal() {
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'none';
    }

    // Toggle theme
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateThemeIcon(isDarkMode);
    }

    // Update theme icon
    function updateThemeIcon(isDarkMode) {
        const icon = themeToggle.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Check user's theme preference
    function checkThemePreference() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
        updateThemeIcon(darkMode);
    }

    // Handle search
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // Show all items
            document.querySelectorAll('.menu-item').forEach(item => {
                item.style.display = 'block';
            });
            return;
        }

        // Filter items
        document.querySelectorAll('.menu-item').forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const desc = item.querySelector('.menu-item-desc').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Handle checkout
    function handleCheckout(e) {
        e.preventDefault();
        
        // In a real app, you would process the payment here
        // For this demo, we'll just show a confirmation
        
        // Generate a random order ID
        const orderId = 'FE-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        orderIdElement.textContent = orderId;
        
        // Clear the cart
        cart = [];
        updateCart();
        
        // Close checkout modal and show confirmation
        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'block';
        
        // Reset form
        checkoutForm.reset();
    }

    // Initialize the app
    init();
});