document.addEventListener('DOMContentLoaded', function() {

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

   
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    
    function init() {
        updateCartCount();
        setupEventListeners();
        checkThemePreference();
    }

   
    function setupEventListeners() {
        
        cartBtn.addEventListener('click', openCartModal);

        
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });

        
        checkoutBtn.addEventListener('click', openCheckoutModal);

        themeToggle.addEventListener('click', toggleTheme);

       
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        
        checkoutForm.addEventListener('submit', handleCheckout);

        
        closeConfirmationBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
        });

        
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

       
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const itemName = this.getAttribute('data-name');
                const itemPrice = parseFloat(this.getAttribute('data-price'));
                addToCart(itemId, itemName, itemPrice);
            });
        });
    }

    
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

    
    function updateCart() {
        updateCartCount();
        renderCartItems();
        saveCartToLocalStorage();
    }

   
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = count;
    }

    
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

        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
        orderTotalElement.textContent = total.toFixed(2);

        
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

    
    function updateCartItemQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        updateCart();
    }

    
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    
    function openCartModal() {
        renderCartItems();
        cartModal.style.display = 'block';
    }

    
    function openCheckoutModal() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to proceed to checkout.');
            return;
        }
        checkoutModal.style.display = 'block';
        cartModal.style.display = 'none';
    }

    
    function closeModal() {
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'none';
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateThemeIcon(isDarkMode);
    }

    
    function updateThemeIcon(isDarkMode) {
        const icon = themeToggle.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    function checkThemePreference() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
        updateThemeIcon(darkMode);
    }

    
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            
            document.querySelectorAll('.menu-item').forEach(item => {
                item.style.display = 'block';
            });
            return;
        }

        
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

    
    function handleCheckout(e) {
        e.preventDefault();
        
        
        const orderId = 'FE-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        orderIdElement.textContent = orderId;
        
       
        cart = [];
        updateCart();
        
       
        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'block';
        
        
        checkoutForm.reset();
    }

    init();
});