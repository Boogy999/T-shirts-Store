// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Add event listener to newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Function to add product to cart
    function addToCart(event) {
        const button = event.target;
        const productCard = button.closest('.product-card');
        const productImage = productCard.querySelector('.product-image img').src;
        const productName = productCard.querySelector('h4').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent.trim();
        
        // Get the selected color (first color dot by default)
        const colorDot = productCard.querySelector('.color-dot');
        const color = colorDot ? getComputedStyle(colorDot).backgroundColor : null;
        
        // Extract price as a number
        const price = parseFloat(productPrice.replace(/[^0-9.]/g, ''));
        
        // Create product object
        const product = {
            id: Date.now().toString(), // Unique ID based on timestamp
            name: productName,
            price: price,
            image: productImage,
            color: color,
            quantity: 1
        };
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => 
            item.name === product.name && item.color === product.color
        );
        
        if (existingProductIndex > -1) {
            // Increment quantity if product already in cart
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart count
        updateCartCount();
        
        // Show add to cart animation
        showAddToCartAnimation(button);
    }

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to update cart count
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Function to show add to cart animation
    function showAddToCartAnimation(button) {
        // Change button text
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.classList.add('added');
        
        // Reset button after animation
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('added');
        }, 1500);
    }

    // Function to handle newsletter form submission
    function handleNewsletterSubmit(event) {
        event.preventDefault();
        const emailInput = event.target.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            // In a real application, you would send this to a server
            // For now, just show a success message
            const form = event.target;
            const formParent = form.parentElement;
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for subscribing to our newsletter!</p>
            `;
            
            // Replace form with success message
            form.style.display = 'none';
            formParent.appendChild(successMessage);
            
            // Reset form and show it again after 5 seconds
            setTimeout(() => {
                form.reset();
                successMessage.remove();
                form.style.display = 'flex';
            }, 5000);
        }
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effect to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.add-to-cart').style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.add-to-cart').style.opacity = '0.9';
        });
    });

    // Add color selection functionality
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            // Remove active class from all dots in the same product
            const productCard = dot.closest('.product-card');
            productCard.querySelectorAll('.color-dot').forEach(d => {
                d.classList.remove('active');
            });
            
            // Add active class to selected dot
            dot.classList.add('active');
        });
    });

    // Add sticky header effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
});
