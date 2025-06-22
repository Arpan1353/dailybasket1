// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Modal and Sidebar Elements
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('showRegister');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const showLoginBtn = document.getElementById('showLogin');
    const overlay = document.getElementById('overlay');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const cartBtn = document.getElementById('cartBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeWishlistBtn = document.getElementById('closeWishlist');
    const closeCartBtn = document.getElementById('closeCart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Product Elements
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const wishlistBtns = document.querySelectorAll('.wishlist');
    const categoryLinks = document.querySelectorAll('.category-link');
    const shopNowBtn = document.querySelector('.shop-now-btn');
    
    // Data Stores
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Initialize the UI
    updateCartCount();
    updateWishlistCount();
    
    // Modal Functions
    function openModal(modal) {
        modal.style.display = 'block';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Sidebar Functions
    function openSidebar(sidebar) {
        sidebar.style.right = '0';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebar(sidebar) {
        sidebar.style.right = '-400px';
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Cart Functions
    function addToCart(productId, productName, productPrice, productImage) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartSidebar();
    }
    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }
    
    function updateCartSidebar() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-sidebar">Your cart is empty</div>';
            cartSummary.style.display = 'none';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
                    <div class="cart-item-total">₹${itemTotal}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
        cartSummary.style.display = 'block';
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartSidebar();
    }
    
    // Wishlist Functions
    function toggleWishlist(productId, productName, productPrice, productImage) {
        const index = wishlist.findIndex(item => item.id === productId);
        const wishlistBtn = document.querySelector(`.wishlist[data-id="${productId}"]`);
        
        if (index === -1) {
            wishlist.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            wishlistBtn.classList.add('active');
        } else {
            wishlist.splice(index, 1);
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            wishlistBtn.classList.remove('active');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        updateWishlistSidebar();
    }
    
    function updateWishlistCount() {
        document.querySelector('.wishlist-count').textContent = wishlist.length;
    }
    
    function updateWishlistSidebar() {
        const wishlistItemsContainer = document.getElementById('wishlistItems');
        
        if (wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = '<div class="empty-sidebar">Your wishlist is empty</div>';
            return;
        }
        
        wishlistItemsContainer.innerHTML = '';
        
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-details">
                    <h4>${item.name}</h4>
                    <div class="wishlist-item-price">₹${item.price}</div>
                </div>
                <div class="wishlist-item-actions">
                    <button class="wishlist-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="wishlist-item-add-to-cart" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}" 
                            data-image="${item.image}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            `;
            
            wishlistItemsContainer.appendChild(wishlistItem);
        });
        
        // Add event listeners to wishlist item buttons
        document.querySelectorAll('.wishlist-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                toggleWishlist(productId);
            });
        });
        
        document.querySelectorAll('.wishlist-item-add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const productPrice = parseFloat(this.getAttribute('data-price'));
                const productImage = this.getAttribute('data-image');
                addToCart(productId, productName, productPrice, productImage);
            });
        });
    }
    
    // Category Filtering
    function filterProductsByCategory(category) {
        const allProducts = document.querySelectorAll('.product-card');
        allProducts.forEach(product => {
            product.style.display = 'none';
        });
        
        if (category) {
            const productsInCategory = document.querySelectorAll(`.product-card[data-category="${category}"]`);
            productsInCategory.forEach(product => {
                product.style.display = 'block';
            });
            
            document.querySelector('.products-grid').scrollIntoView({
                behavior: 'smooth'
            });
            
            const categoryName = document.querySelector(`.category-link[data-category="${category}"]`).textContent;
            document.querySelector('.section-title').textContent = categoryName;
        }
    }
    
    // Initialize wishlist button states
    function initializeWishlistButtons() {
        wishlistBtns.forEach(btn => {
            const productId = btn.closest('.product-card').querySelector('.add-to-cart').getAttribute('data-id');
            const isInWishlist = wishlist.some(item => item.id === productId);
            
            if (isInWishlist) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.classList.add('active');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.classList.remove('active');
            }
        });
    }
    
    // Add category data attributes to product cards
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productTitle = product.querySelector('.product-title').textContent;
        
        if (productTitle.includes('Apple') || productTitle.includes('Banana') || 
            productTitle.includes('Potato') || productTitle.includes('Tomato') || 
            productTitle.includes('Onion')) {
            product.setAttribute('data-category', 'fruits-vegetables');
        } 
        else if (productTitle.includes('Milk') || productTitle.includes('Egg') || 
                 productTitle.includes('Curd')) {
            product.setAttribute('data-category', 'dairy-eggs');
        }
        else if (productTitle.includes('Chicken')) {
            product.setAttribute('data-category', 'meat');
        }
        else if (productTitle.includes('Bread')) {
            product.setAttribute('data-category', 'snacks');
        }
        else if (productTitle.includes('Rice')) {
            product.setAttribute('data-category', 'snacks');
        }
        else if (productTitle.includes('Butter')) {
            product.setAttribute('data-category', 'dairy-eggs');
        }
    });
    
    // Event Listeners
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(loginModal);
    });
    
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });
    
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    overlay.addEventListener('click', function() {
        closeModal(loginModal);
        closeModal(registerModal);
        closeSidebar(wishlistSidebar);
        closeSidebar(cartSidebar);
    });
    
    wishlistBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSidebar(wishlistSidebar);
        updateWishlistSidebar();
    });
    
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSidebar(cartSidebar);
        updateCartSidebar();
    });
    
    closeWishlistBtn.addEventListener('click', function() {
        closeSidebar(wishlistSidebar);
    });
    
    closeCartBtn.addEventListener('click', function() {
        closeSidebar(cartSidebar);
    });
    
    checkoutBtn.addEventListener('click', function() {
        alert('Proceeding to checkout!');
        // In a real app, this would redirect to checkout page
    });
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            addToCart(productId, productName, productPrice, productImage);
            
            // Show added to cart feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1000);
        });
    });
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.querySelector('.add-to-cart').getAttribute('data-id');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('₹', ''));
            const productImage = productCard.querySelector('.product-image img').src;
            
            toggleWishlist(productId, productName, productPrice, productImage);
        });
    });
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
            
            // Close the dropdown
            document.querySelector('.dropdown-content').style.display = 'none';
        });
    });
    
    shopNowBtn.addEventListener('click', function() {
        // Scroll to products section
        document.querySelector('.products-grid').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Form Submissions
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
            document.getElementById('loginError').textContent = 'Please fill in all fields';
            return;
        }
        
        // Simulate login (in a real app, this would be an API call)
        setTimeout(() => {
            document.getElementById('loginText').textContent = 'My Account';
            closeModal(loginModal);
            document.getElementById('loginError').textContent = '';
            alert('Login successful!');
        }, 500);
    });
    
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            document.getElementById('registerError').textContent = 'Please fill in all fields';
            return;
        }
        
        if (password !== confirmPassword) {
            document.getElementById('registerError').textContent = 'Passwords do not match';
            return;
        }
        
        if (password.length < 6) {
            document.getElementById('registerError').textContent = 'Password must be at least 6 characters';
            return;
        }
        
        // Simulate registration (in a real app, this would be an API call)
        setTimeout(() => {
            closeModal(registerModal);
            openModal(loginModal);
            document.getElementById('registerError').textContent = '';
            alert('Registration successful! Please login.');
        }, 500);
    });
    
    // Initialize UI
    initializeWishlistButtons();
    updateCartSidebar();
    updateWishlistSidebar();
    
    // Show all products by default
    document.querySelectorAll('.product-card').forEach(product => {
        product.style.display = 'block';
    });
});
