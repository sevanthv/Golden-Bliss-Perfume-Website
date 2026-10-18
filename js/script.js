// ===================================================
// GOLDEN BLISS - MAIN APPLICATION CONTROLLER
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderFeaturedGrid();
    renderShopCatalog();
    initFilterEvents();
    initQuickViewEvents();
    initCheckoutEvents();
    initQuiz();
    updateCartUI();
    updateWishlistUI();
    updateOrdersCountBadge();
    initNavigationEvents();
    initContactAndNewsletter();
}

// ----------------------------------------------------
// 1. FEATURED PRODUCTS
// ----------------------------------------------------
function renderFeaturedGrid() {
    const container = document.getElementById('featuredGrid');
    if (!container) return;

    const featured = perfumeProducts.filter(p => p.isFeatured).slice(0, 4);

    container.innerHTML = featured.map(product => {
        const defaultPrice = product.sizes[1] ? product.sizes[1].price : product.sizes[0].price;
        const isHearted = isInWishlist(product.id);

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card-badge">${product.badge}</div>
                <button class="wishlist-toggle-btn ${isHearted ? 'active' : ''}" data-product-id="${product.id}" onclick="toggleWishlist('${product.id}')" title="Save to Wishlist">
                    ${isHearted ? '❤️' : '♡'}
                </button>
                
                <div class="product-img-box" onclick="openQuickView('${product.id}')">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="quick-view-overlay">
                        <span>🔍 Quick View</span>
                    </div>
                </div>

                <div class="product-info-box">
                    <div class="product-meta-row">
                        <span class="product-family">${product.family.toUpperCase()}</span>
                        <span class="product-rating">★ ${product.rating.toFixed(1)} <small>(${product.reviewsCount})</small></span>
                    </div>

                    <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.name}</h3>
                    <p class="product-sub">${product.subtitle}</p>

                    <div class="product-notes-chips">
                        ${product.notes.top.slice(0, 2).map(n => `<span class="chip">${n}</span>`).join('')}
                    </div>

                    <div class="product-bottom-row">
                        <div class="product-price-col">
                            <span class="price-val">₹${defaultPrice.toLocaleString('en-IN')}</span>
                            <span class="price-unit">${product.defaultSize}</span>
                        </div>

                        <button class="card-add-btn" onclick="addToCart('${product.id}', '${product.defaultSize}', 1)">
                            + Add to Bag
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ----------------------------------------------------
// 2. SHOP CATALOG & FILTERS
// ----------------------------------------------------
let activeGender = 'all';
let activeFamily = 'all';
let activePrice = 'all';
let activeSort = 'featured';
let searchQuery = '';

function initFilterEvents() {
    // Gender Pills
    const genderPills = document.querySelectorAll('.gender-pill-btn');
    genderPills.forEach(pill => {
        pill.addEventListener('click', () => {
            genderPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeGender = pill.dataset.gender;
            renderShopCatalog();
        });
    });

    // Family Filter
    const familySelect = document.getElementById('familyFilterSelect');
    if (familySelect) {
        familySelect.addEventListener('change', (e) => {
            activeFamily = e.target.value;
            renderShopCatalog();
        });
    }

    // Price Filter
    const priceSelect = document.getElementById('priceFilterSelect');
    if (priceSelect) {
        priceSelect.addEventListener('change', (e) => {
            activePrice = e.target.value;
            renderShopCatalog();
        });
    }

    // Sort Filter
    const sortSelect = document.getElementById('sortFilterSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            activeSort = e.target.value;
            renderShopCatalog();
        });
    }

    // Search Input
    const searchInput = document.getElementById('shopSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderShopCatalog();
        });
    }

    // Reset Filters Button
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeGender = 'all';
            activeFamily = 'all';
            activePrice = 'all';
            activeSort = 'featured';
            searchQuery = '';

            genderPills.forEach(p => p.classList.toggle('active', p.dataset.gender === 'all'));
            if (familySelect) familySelect.value = 'all';
            if (priceSelect) priceSelect.value = 'all';
            if (sortSelect) sortSelect.value = 'featured';
            if (searchInput) searchInput.value = '';

            renderShopCatalog();
            showToast('Filters Reset', 'Showing all luxury fragrances.', 'info');
        });
    }
}

function renderShopCatalog() {
    const container = document.getElementById('shopProductsGrid');
    const resultCountEl = document.getElementById('shopResultCount');
    const noResultsEl = document.getElementById('shopNoResults');

    if (!container) return;

    let filtered = perfumeProducts.filter(p => {
        // Gender check
        if (activeGender !== 'all' && p.gender !== activeGender) return false;
        
        // Family check
        if (activeFamily !== 'all' && p.family !== activeFamily) return false;

        // Search check
        if (searchQuery) {
            const matchName = p.name.toLowerCase().includes(searchQuery);
            const matchDesc = p.description.toLowerCase().includes(searchQuery);
            const matchNotes = Object.values(p.notes).flat().some(n => n.toLowerCase().includes(searchQuery));
            if (!matchName && !matchDesc && !matchNotes) return false;
        }

        // Price check (based on 50ml or default size)
        const defaultPrice = p.sizes[1] ? p.sizes[1].price : p.sizes[0].price;
        if (activePrice === 'under2000' && defaultPrice >= 2000) return false;
        if (activePrice === '2000-3000' && (defaultPrice < 2000 || defaultPrice > 3000)) return false;
        if (activePrice === 'above3000' && defaultPrice <= 3000) return false;

        return true;
    });

    // Sorting
    if (activeSort === 'price-low') {
        filtered.sort((a, b) => (a.sizes[0].price) - (b.sizes[0].price));
    } else if (activeSort === 'price-high') {
        filtered.sort((a, b) => (b.sizes[0].price) - (a.sizes[0].price));
    } else if (activeSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    if (resultCountEl) {
        resultCountEl.textContent = `Showing ${filtered.length} of ${perfumeProducts.length} fragrances`;
    }

    if (filtered.length === 0) {
        container.innerHTML = '';
        if (noResultsEl) noResultsEl.style.display = 'block';
        return;
    }

    if (noResultsEl) noResultsEl.style.display = 'none';

    container.innerHTML = filtered.map(product => {
        const defaultPrice = product.sizes[1] ? product.sizes[1].price : product.sizes[0].price;
        const isHearted = isInWishlist(product.id);

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card-badge">${product.badge}</div>
                <button class="wishlist-toggle-btn ${isHearted ? 'active' : ''}" data-product-id="${product.id}" onclick="toggleWishlist('${product.id}')" title="Save to Wishlist">
                    ${isHearted ? '❤️' : '♡'}
                </button>
                
                <div class="product-img-box" onclick="openQuickView('${product.id}')">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="quick-view-overlay">
                        <span>🔍 Quick View</span>
                    </div>
                </div>

                <div class="product-info-box">
                    <div class="product-meta-row">
                        <span class="product-family">${product.family.toUpperCase()} • ${product.gender.toUpperCase()}</span>
                        <span class="product-rating">★ ${product.rating.toFixed(1)} <small>(${product.reviewsCount})</small></span>
                    </div>

                    <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.name}</h3>
                    <p class="product-sub">${product.subtitle}</p>

                    <div class="product-notes-chips">
                        ${product.notes.top.slice(0, 2).map(n => `<span class="chip">${n}</span>`).join('')}
                    </div>

                    <div class="product-bottom-row">
                        <div class="product-price-col">
                            <span class="price-val">₹${defaultPrice.toLocaleString('en-IN')}</span>
                            <span class="price-unit">${product.defaultSize}</span>
                        </div>

                        <button class="card-add-btn" onclick="addToCart('${product.id}', '${product.defaultSize}', 1)">
                            + Add to Bag
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ----------------------------------------------------
// 3. QUICK VIEW & PRODUCT DETAILS MODAL
// ----------------------------------------------------
let modalSelectedProductId = null;
let modalSelectedSize = null;
let modalQuantity = 1;

function initQuickViewEvents() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.getElementById('closeQuickViewBtn');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuickView);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeQuickView();
        });
    }
}

function openQuickView(productId) {
    const product = getPerfumeById(productId);
    if (!product) return;

    modalSelectedProductId = String(product.id);
    modalSelectedSize = product.defaultSize;
    modalQuantity = 1;

    const modal = document.getElementById('quickViewModal');
    const imgEl = document.getElementById('modalProductImg');
    const badgeEl = document.getElementById('modalProductBadge');
    const familyEl = document.getElementById('modalProductFamily');
    const titleEl = document.getElementById('modalProductTitle');
    const subtitleEl = document.getElementById('modalProductSubtitle');
    const ratingEl = document.getElementById('modalProductRating');
    const priceEl = document.getElementById('modalProductPrice');
    const descEl = document.getElementById('modalProductDesc');
    const topNotesEl = document.getElementById('modalTopNotes');
    const heartNotesEl = document.getElementById('modalHeartNotes');
    const baseNotesEl = document.getElementById('modalBaseNotes');
    const longevityEl = document.getElementById('modalLongevity');
    const sillageEl = document.getElementById('modalSillage');
    const occasionEl = document.getElementById('modalOccasion');
    const sizePillsContainer = document.getElementById('modalSizePills');
    const qtyValEl = document.getElementById('modalQtyVal');
    const wishBtn = document.getElementById('modalWishlistBtn');

    if (imgEl) imgEl.src = product.image;
    if (badgeEl) badgeEl.textContent = product.badge;
    if (familyEl) familyEl.textContent = `${product.family.toUpperCase()} • ${product.gender.toUpperCase()}`;
    if (titleEl) titleEl.textContent = product.name;
    if (subtitleEl) subtitleEl.textContent = product.subtitle;
    if (ratingEl) ratingEl.innerHTML = `★ ${product.rating.toFixed(1)} <span>(${product.reviewsCount} verified reviews)</span>`;
    if (descEl) descEl.textContent = product.description;
    
    if (topNotesEl) topNotesEl.innerHTML = product.notes.top.map(n => `<span class="note-tag">${n}</span>`).join('');
    if (heartNotesEl) heartNotesEl.innerHTML = product.notes.heart.map(n => `<span class="note-tag">${n}</span>`).join('');
    if (baseNotesEl) baseNotesEl.innerHTML = product.notes.base.map(n => `<span class="note-tag">${n}</span>`).join('');

    if (longevityEl) longevityEl.textContent = product.longevity;
    if (sillageEl) sillageEl.textContent = product.sillage;
    if (occasionEl) occasionEl.textContent = product.occasion;

    if (qtyValEl) qtyValEl.textContent = modalQuantity;

    // Render Size Pills
    if (sizePillsContainer) {
        sizePillsContainer.innerHTML = product.sizes.map(s => `
            <button class="size-pill-btn ${s.size === modalSelectedSize ? 'active' : ''}" onclick="selectModalSize('${s.size}', ${s.price})">
                <span class="size-name">${s.size}</span>
                <span class="size-price">₹${s.price.toLocaleString('en-IN')}</span>
            </button>
        `).join('');
    }

    const defaultSizeObj = product.sizes.find(s => s.size === modalSelectedSize) || product.sizes[0];
    if (priceEl) priceEl.textContent = `₹${defaultSizeObj.price.toLocaleString('en-IN')}`;

    if (wishBtn) {
        const isHearted = isInWishlist(product.id);
        wishBtn.innerHTML = isHearted ? '❤️ Saved to Wishlist' : '♡ Add to Wishlist';
        wishBtn.onclick = () => {
            toggleWishlist(product.id);
            wishBtn.innerHTML = isInWishlist(product.id) ? '❤️ Saved to Wishlist' : '♡ Add to Wishlist';
        };
    }

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function selectModalSize(size, price) {
    modalSelectedSize = size;
    const priceEl = document.getElementById('modalProductPrice');
    if (priceEl) priceEl.textContent = `₹${price.toLocaleString('en-IN')}`;

    const pills = document.querySelectorAll('.size-pill-btn');
    pills.forEach(p => {
        p.classList.toggle('active', p.querySelector('.size-name').textContent === size);
    });
}

function changeModalQty(delta) {
    modalQuantity = Math.max(1, modalQuantity + delta);
    const qtyValEl = document.getElementById('modalQtyVal');
    if (qtyValEl) qtyValEl.textContent = modalQuantity;
}

function addModalToCart() {
    if (!modalSelectedProductId) return;
    addToCart(modalSelectedProductId, modalSelectedSize, modalQuantity);
    closeQuickView();
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ----------------------------------------------------
// 4. CHECKOUT & INVOICE FLOW
// ----------------------------------------------------
function initCheckoutEvents() {
    // Payment method selector tabs
    const paymentRadios = document.querySelectorAll('input[name="checkoutPayment"]');
    const upiBox = document.getElementById('upiPaymentDetails');
    const cardBox = document.getElementById('cardPaymentDetails');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (upiBox) upiBox.style.display = e.target.value === 'upi' ? 'block' : 'none';
            if (cardBox) cardBox.style.display = e.target.value === 'card' ? 'block' : 'none';
        });
    });

    // Place Order Button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkoutItemsList');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const discountRow = document.getElementById('checkoutDiscountRow');
    const discountEl = document.getElementById('checkoutDiscount');
    const shippingEl = document.getElementById('checkoutShipping');
    const totalEl = document.getElementById('checkoutTotal');

    if (!container) return;

    const summary = getCartSummary();

    if (cart.length === 0) {
        container.innerHTML = `<p class="checkout-empty-msg">Your shopping bag is currently empty.</p>`;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="checkout-item-preview">
                <img src="${item.image}" alt="${item.name}">
                <div class="checkout-item-desc">
                    <h5>${item.name} (${item.size})</h5>
                    <small>Qty: ${item.quantity}</small>
                </div>
                <strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong>
            </div>
        `).join('');
    }

    if (subtotalEl) subtotalEl.textContent = `₹${summary.subtotal.toLocaleString('en-IN')}`;
    
    if (discountRow && discountEl) {
        if (summary.discount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `-₹${summary.discount.toLocaleString('en-IN')}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    if (shippingEl) {
        shippingEl.innerHTML = summary.shipping === 0 ? '<span class="free-shipping-tag">FREE</span>' : `₹${summary.shipping.toLocaleString('en-IN')}`;
    }

    if (totalEl) totalEl.textContent = `₹${summary.grandTotal.toLocaleString('en-IN')}`;
}

function handlePlaceOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
        showToast('Bag is Empty', 'Please add at least one fragrance to your bag before checking out.', 'warning');
        return;
    }

    const fullName = document.getElementById('checkoutFullName')?.value.trim();
    const email = document.getElementById('checkoutEmail')?.value.trim();
    const phone = document.getElementById('checkoutPhone')?.value.trim();
    const address = document.getElementById('checkoutAddress')?.value.trim();
    const city = document.getElementById('checkoutCity')?.value.trim();
    const state = document.getElementById('checkoutState')?.value.trim();
    const pincode = document.getElementById('checkoutPincode')?.value.trim();
    const paymentMethod = document.querySelector('input[name="checkoutPayment"]:checked')?.value || 'cod';

    // Basic Validations
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
        showToast('Incomplete Details', 'Please fill in all mandatory delivery details.', 'warning');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
        return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        showToast('Invalid Phone Number', 'Please enter a valid 10-digit contact number.', 'warning');
        return;
    }

    const pincodeDigits = pincode.replace(/\D/g, '');
    if (pincodeDigits.length !== 6) {
        showToast('Invalid PIN Code', 'Please enter a valid 6-digit postal PIN code.', 'warning');
        return;
    }

    // If UPI selected, open simulated interactive UPI modal first
    if (paymentMethod === 'upi') {
        openUpiModal({
            fullName, email, phone, address, city, state, pincode, paymentMethod
        });
        return;
    }

    // If Card selected, basic card check
    if (paymentMethod === 'card') {
        const cardNum = document.getElementById('cardNumber')?.value.trim();
        const cardExp = document.getElementById('cardExpiry')?.value.trim();
        const cardCvv = document.getElementById('cardCvv')?.value.trim();

        if (!cardNum || !cardExp || !cardCvv) {
            showToast('Card Details Required', 'Please enter complete card details.', 'warning');
            return;
        }
    }

    finalizeOrder({
        fullName, email, phone, address, city, state, pincode, paymentMethod
    });
}

function finalizeOrder(customer) {
    const summary = getCartSummary();
    const orderNumber = 'GB-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const orderData = {
        orderId: orderNumber,
        date: orderDate,
        customer,
        items: [...cart],
        summary
    };

    // Save order history in localStorage
    const orderHistory = JSON.parse(localStorage.getItem('goldenbliss_orders')) || [];
    orderHistory.unshift(orderData);
    localStorage.setItem('goldenbliss_orders', JSON.stringify(orderHistory));

    // Display Invoice Modal
    renderOrderConfirmationModal(orderData);

    // Clear cart
    clearCart();
}

function renderOrderConfirmationModal(order) {
    const modal = document.getElementById('orderConfirmationModal');
    if (!modal) return;

    document.getElementById('confOrderId').textContent = order.orderId;
    document.getElementById('confOrderDate').textContent = order.date;
    document.getElementById('confCustomerName').textContent = order.customer.fullName;
    document.getElementById('confCustomerAddress').textContent = `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;
    document.getElementById('confPaymentMethod').textContent = order.customer.paymentMethod.toUpperCase();

    const itemsContainer = document.getElementById('confItemsList');
    if (itemsContainer) {
        itemsContainer.innerHTML = order.items.map(item => `
            <div class="conf-item-row">
                <span>${item.name} (${item.size}) × ${item.quantity}</span>
                <strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong>
            </div>
        `).join('');
    }

    document.getElementById('confSubtotal').textContent = `₹${order.summary.subtotal.toLocaleString('en-IN')}`;
    
    const discRow = document.getElementById('confDiscountRow');
    if (discRow) {
        if (order.summary.discount > 0) {
            discRow.style.display = 'flex';
            document.getElementById('confDiscount').textContent = `-₹${order.summary.discount.toLocaleString('en-IN')}`;
        } else {
            discRow.style.display = 'none';
        }
    }

    document.getElementById('confShipping').textContent = order.summary.shipping === 0 ? 'FREE' : `₹${order.summary.shipping.toLocaleString('en-IN')}`;
    document.getElementById('confTotal').textContent = `₹${order.summary.grandTotal.toLocaleString('en-IN')}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrderConfirmation() {
    const modal = document.getElementById('orderConfirmationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Scroll smoothly to shop
    const shopSection = document.getElementById('shop');
    if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
}

// ----------------------------------------------------
// 5. UPI PAYMENT SIMULATION MODAL
// ----------------------------------------------------
let pendingUpiOrder = null;
let upiTimerInterval = null;

function openUpiModal(customerData) {
    pendingUpiOrder = customerData;
    const modal = document.getElementById('upiSimModal');
    const summary = getCartSummary();

    if (!modal) return;

    document.getElementById('upiModalAmount').textContent = `₹${summary.grandTotal.toLocaleString('en-IN')}`;
    
    // 5-minute countdown
    let timeLeft = 300;
    const timerEl = document.getElementById('upiTimerVal');
    if (upiTimerInterval) clearInterval(upiTimerInterval);

    upiTimerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(upiTimerInterval);
            closeUpiModal();
            showToast('Payment Timed Out', 'UPI transaction window expired. Please try again.', 'error');
            return;
        }
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        if (timerEl) timerEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }, 1000);

    modal.classList.add('active');
}

function closeUpiModal() {
    const modal = document.getElementById('upiSimModal');
    if (modal) modal.classList.remove('active');
    if (upiTimerInterval) clearInterval(upiTimerInterval);
    pendingUpiOrder = null;
}

function confirmSimulatedUpiPayment() {
    if (!pendingUpiOrder) return;
    const orderData = { ...pendingUpiOrder };
    closeUpiModal();
    showToast('Payment Verified! ✨', 'Your UPI transaction was successfully authorized.', 'success');
    finalizeOrder(orderData);
}

// ----------------------------------------------------
// 6. TOAST NOTIFICATION SYSTEM
// ----------------------------------------------------
function showToast(title, message, iconType = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${iconType}`;

    let iconSymbol = '✦';
    if (iconType === 'bag') iconSymbol = '🛍️';
    else if (iconType === 'heart') iconSymbol = '❤️';
    else if (iconType === 'heart-off') iconSymbol = '🤍';
    else if (iconType === 'success') iconSymbol = '✓';
    else if (iconType === 'warning') iconSymbol = '⚠️';
    else if (iconType === 'error') iconSymbol = '✕';

    toast.innerHTML = `
        <div class="toast-icon">${iconSymbol}</div>
        <div class="toast-text">
            <h5>${title}</h5>
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

// ----------------------------------------------------
// 7. NAVIGATION & MODAL CONTROLS
// ----------------------------------------------------
function initNavigationEvents() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const drawerOverlay = document.getElementById('drawerOverlay');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', () => {
            closeCartDrawer();
            closeWishlistDrawer();
            closeQuickView();
        });
    }

    // Scroll header background transition
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
}

// ----------------------------------------------------
// 8. CONTACT & NEWSLETTER HANDLERS
// ----------------------------------------------------
function initContactAndNewsletter() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value.trim();
            const email = document.getElementById('contactEmail')?.value.trim();
            const message = document.getElementById('contactMessage')?.value.trim();

            if (!name || !email || !message) {
                showToast('Incomplete Form', 'Please complete all message fields.', 'warning');
                return;
            }

            contactForm.reset();
            showToast('Message Received ✉️', `Thank you ${name}. A fragrance concierge will respond within 24 hours.`, 'success');
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput && emailInput.value.trim()) {
                const email = emailInput.value.trim();
                newsletterForm.reset();
                showToast('Welcome to Golden Bliss VIP ✨', `Use coupon code "GOLDEN10" for 10% off your first luxury fragrance.`, 'success');
            }
        });
    }
}


// ===================================================
// 9. ORDERS DASHBOARD & EXPORT SYSTEM
// ===================================================

function getSavedOrders() {
    return JSON.parse(localStorage.getItem('goldenbliss_orders')) || [];
}

function updateOrdersCountBadge() {
    const orders = getSavedOrders();
    const badge = document.getElementById('navOrdersCount');
    if (badge) {
        badge.textContent = orders.length;
        badge.style.display = orders.length > 0 ? 'inline-flex' : 'none';
    }
}

function openOrdersModal() {
    const modal = document.getElementById('ordersDashboardModal');
    if (modal) {
        renderOrdersList();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeOrdersModal() {
    const modal = document.getElementById('ordersDashboardModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderOrdersList(filteredOrders = null) {
    const container = document.getElementById('ordersListContainer');
    const emptyState = document.getElementById('ordersEmptyState');
    const orders = filteredOrders !== null ? filteredOrders : getSavedOrders();

    updateOrdersCountBadge();

    if (!container || !emptyState) return;

    if (orders.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = orders.map((order, idx) => {
        const status = order.status || 'Confirmed';
        let statusClass = 'status-confirmed';
        if (status === 'Processing') statusClass = 'status-processing';
        else if (status === 'Shipped') statusClass = 'status-shipped';
        else if (status === 'Delivered') statusClass = 'status-delivered';

        return `
            <div class="order-entry-card" data-order-id="${order.orderId}">
                <div class="order-card-top">
                    <div>
                        <span class="order-id-tag">🏷️ ${order.orderId}</span>
                        <span class="order-date-text"> • Placed on ${order.date}</span>
                    </div>
                    <span class="order-status-badge ${statusClass}">${status}</span>
                </div>

                <div class="order-card-grid">
                    <!-- Customer Details -->
                    <div class="order-customer-info">
                        <h5>👤 Customer & Shipping</h5>
                        <p>
                            <strong>${order.customer.fullName}</strong><br>
                            📞 ${order.customer.phone}<br>
                            ✉️ ${order.customer.email}<br>
                            📍 ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
                        </p>
                    </div>

                    <!-- Ordered Items -->
                    <div class="order-items-info">
                        <h5>🧴 Items Ordered (${order.items.reduce((s, i) => s + i.quantity, 0)})</h5>
                        <div class="order-items-mini-list">
                            ${order.items.map(item => `
                                <div class="order-mini-item">
                                    <img src="${item.image}" alt="${item.name}">
                                    <div>
                                        <strong>${item.name}</strong> (${item.size})<br>
                                        <small style="color:var(--text-muted);">${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</small>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Payment & Total -->
                    <div class="order-payment-info">
                        <h5>💳 Payment Info</h5>
                        <p style="color: var(--text-secondary); font-size: 0.88rem;">
                            Method: <strong>${order.customer.paymentMethod.toUpperCase()}</strong><br>
                            Delivery: <strong>${order.summary.shipping === 0 ? 'FREE' : '₹' + order.summary.shipping}</strong>
                            ${order.summary.discount > 0 ? `<br>Discount: <span style="color:#2ECC71;">-₹${order.summary.discount.toLocaleString('en-IN')}</span>` : ''}
                        </p>
                        <strong>₹${order.summary.grandTotal.toLocaleString('en-IN')}</strong>
                    </div>
                </div>

                <!-- Actions Bar -->
                <div class="order-card-actions">
                    <label style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                        Status:
                        <select class="order-status-select" onchange="changeOrderStatus('${order.orderId}', this.value)">
                            <option value="Confirmed" ${status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="Processing" ${status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Shipped" ${status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </label>

                    <button class="order-action-btn" onclick="viewOrderInvoiceById('${order.orderId}')">
                        🖨️ View / Print Invoice
                    </button>
                    <button class="order-action-btn" onclick="deleteOrderById('${order.orderId}')" style="color: #E74C3C; border-color: rgba(231, 76, 60, 0.4);">
                        ✕ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterOrdersList() {
    const query = document.getElementById('orderSearchInput')?.value.trim().toLowerCase();
    const orders = getSavedOrders();

    if (!query) {
        renderOrdersList(orders);
        return;
    }

    const filtered = orders.filter(o => {
        const idMatch = o.orderId.toLowerCase().includes(query);
        const nameMatch = o.customer.fullName.toLowerCase().includes(query);
        const phoneMatch = o.customer.phone.toLowerCase().includes(query);
        const emailMatch = o.customer.email.toLowerCase().includes(query);
        return idMatch || nameMatch || phoneMatch || emailMatch;
    });

    renderOrdersList(filtered);
}

function changeOrderStatus(orderId, newStatus) {
    const orders = getSavedOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('goldenbliss_orders', JSON.stringify(orders));
        showToast('Order Status Updated', `Order ${orderId} marked as "${newStatus}".`, 'success');
        renderOrdersList();
    }
}

function deleteOrderById(orderId) {
    if (!confirm(`Are you sure you want to remove Order ${orderId}?`)) return;
    let orders = getSavedOrders();
    orders = orders.filter(o => o.orderId !== orderId);
    localStorage.setItem('goldenbliss_orders', JSON.stringify(orders));
    showToast('Order Removed', `Order ${orderId} deleted from records.`, 'info');
    renderOrdersList();
}

function clearAllOrders() {
    const orders = getSavedOrders();
    if (orders.length === 0) {
        showToast('No Orders', 'Order history is already empty.', 'info');
        return;
    }
    if (!confirm('Are you sure you want to clear all order history? This cannot be undone.')) return;
    localStorage.removeItem('goldenbliss_orders');
    showToast('Order History Cleared', 'All orders have been removed.', 'info');
    renderOrdersList();
}

function viewOrderInvoiceById(orderId) {
    const orders = getSavedOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;
    closeOrdersModal();
    renderOrderConfirmationModal(order);
}

function exportOrdersToCSV() {
    const orders = getSavedOrders();
    if (orders.length === 0) {
        showToast('No Orders to Export', 'There are no placed orders in the records yet.', 'warning');
        return;
    }

    const headers = ["Order ID", "Date", "Customer Name", "Email", "Phone", "Address", "City", "State", "PIN Code", "Payment Method", "Status", "Items Count", "Items Breakdown", "Subtotal (INR)", "Discount (INR)", "Shipping (INR)", "Grand Total (INR)"];
    
    const rows = orders.map(o => {
        const itemsStr = o.items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join('; ');
        return [
            `"${o.orderId}"`,
            `"${o.date}"`,
            `"${o.customer.fullName.replace(/"/g, '""')}"`,
            `"${o.customer.email}"`,
            `"${o.customer.phone}"`,
            `"${o.customer.address.replace(/"/g, '""')}"`,
            `"${o.customer.city}"`,
            `"${o.customer.state}"`,
            `"${o.customer.pincode}"`,
            `"${o.customer.paymentMethod.toUpperCase()}"`,
            `"${o.status || 'Confirmed'}"`,
            o.items.reduce((s, i) => s + i.quantity, 0),
            `"${itemsStr.replace(/"/g, '""')}"`,
            o.summary.subtotal,
            o.summary.discount,
            o.summary.shipping,
            o.summary.grandTotal
        ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Golden_Bliss_Orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Successful 📥', 'Orders CSV spreadsheet downloaded.', 'success');
}
