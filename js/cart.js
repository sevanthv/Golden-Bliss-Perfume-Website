// ===================================================
// GOLDEN BLISS - SHOPPING CART & PROMO CONTROLLER
// ===================================================

const FREE_SHIPPING_THRESHOLD = 2499;
const STANDARD_SHIPPING_FEE = 149;

let cart = JSON.parse(localStorage.getItem('goldenbliss_cart')) || [];
let activePromo = JSON.parse(localStorage.getItem('goldenbliss_promo')) || null;

function saveCart() {
    localStorage.setItem('goldenbliss_cart', JSON.stringify(cart));
    if (activePromo) {
        localStorage.setItem('goldenbliss_promo', JSON.stringify(activePromo));
    } else {
        localStorage.removeItem('goldenbliss_promo');
    }
    updateCartUI();
}

function addToCart(productId, size, quantity = 1) {
    const product = getPerfumeById(productId);
    if (!product) return;

    const chosenSize = size || product.defaultSize;
    const sizeObj = product.sizes.find(s => s.size === chosenSize) || product.sizes[1] || product.sizes[0];
    const itemPrice = sizeObj ? sizeObj.price : product.sizes[0].price;

    const existingIndex = cart.findIndex(item => item.id === String(productId) && item.size === chosenSize);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += Number(quantity);
    } else {
        cart.push({
            id: String(product.id),
            name: product.name,
            subtitle: product.subtitle,
            image: product.image,
            size: chosenSize,
            price: itemPrice,
            quantity: Number(quantity)
        });
    }

    saveCart();
    showToast(`Added to Bag`, `${product.name} (${chosenSize}) has been added to your shopping bag.`, 'bag');
    openCartDrawer();
}

function updateCartQuantity(index, delta) {
    if (index < 0 || index >= cart.length) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
    }
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    showToast(`Item Removed`, `${removedItem.name} removed from your bag.`, 'info');
}

function clearCart() {
    cart = [];
    activePromo = null;
    saveCart();
}

function applyPromoCode(codeStr) {
    const code = (codeStr || '').trim().toUpperCase();
    if (!code) {
        showToast('Promo Code', 'Please enter a valid coupon code.', 'warning');
        return false;
    }

    const promoInfo = PROMO_CODES[code];
    if (!promoInfo) {
        showToast('Invalid Coupon', 'This coupon code does not exist.', 'error');
        return false;
    }

    const subtotal = getCartSubtotal();
    if (promoInfo.minSpend && subtotal < promoInfo.minSpend) {
        showToast('Minimum Spend Required', `This coupon requires a minimum spend of ₹${promoInfo.minSpend.toLocaleString('en-IN')}.`, 'warning');
        return false;
    }

    activePromo = {
        code: code,
        ...promoInfo
    };
    saveCart();
    showToast('Promo Code Applied! 🎉', `Coupon "${code}" applied successfully!`, 'success');
    return true;
}

function removePromoCode() {
    activePromo = null;
    saveCart();
    showToast('Coupon Removed', 'Promo code removed from your order.', 'info');
}

function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartSummary() {
    const subtotal = getCartSubtotal();
    let discount = 0;

    if (activePromo) {
        if (activePromo.discountPercent) {
            discount = Math.round((subtotal * activePromo.discountPercent) / 100);
        } else if (activePromo.flatDiscount) {
            discount = Math.min(activePromo.flatDiscount, subtotal);
        }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE);
    const grandTotal = discountedSubtotal + shipping;
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);

    const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return {
        subtotal,
        discount,
        shipping,
        grandTotal,
        totalItems,
        progress,
        amountNeeded,
        promo: activePromo
    };
}

function updateCartUI() {
    const summary = getCartSummary();

    // Update navbar badges
    const cartCountBadges = document.querySelectorAll('.cart-count-badge');
    cartCountBadges.forEach(badge => {
        badge.textContent = summary.totalItems;
        badge.style.display = summary.totalItems > 0 ? 'inline-flex' : 'none';
    });

    renderCartDrawer();
    renderCheckoutSummary();
}

function renderCartDrawer() {
    const container = document.getElementById('cartDrawerItems');
    const emptyState = document.getElementById('cartDrawerEmpty');
    const footer = document.getElementById('cartDrawerFooter');
    const freeShippingText = document.getElementById('freeShippingText');
    const freeShippingBar = document.getElementById('freeShippingProgressBar');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    const discountRow = document.getElementById('cartDrawerDiscountRow');
    const discountEl = document.getElementById('cartDrawerDiscount');
    const shippingEl = document.getElementById('cartDrawerShipping');
    const totalEl = document.getElementById('cartDrawerTotal');
    const promoBadge = document.getElementById('activePromoBadge');
    const promoInput = document.getElementById('cartPromoInput');

    if (!container) return;

    const summary = getCartSummary();

    if (freeShippingText && freeShippingBar) {
        if (summary.amountNeeded === 0 && summary.subtotal > 0) {
            freeShippingText.innerHTML = '✨ <strong>Complimentary Luxury Shipping Unlocked!</strong>';
            freeShippingBar.style.width = '100%';
        } else {
            freeShippingText.innerHTML = `Add <strong>₹${summary.amountNeeded.toLocaleString('en-IN')}</strong> more for <strong>FREE Luxury Delivery</strong>`;
            freeShippingBar.style.width = `${summary.progress}%`;
        }
    }

    if (cart.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (footer) footer.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footer) footer.style.display = 'block';

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item-row" data-index="${index}">
            <div class="cart-item-img-wrap">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <h4>${item.name}</h4>
                    <button class="cart-item-remove-btn" onclick="removeFromCart(${index})" title="Remove item">✕</button>
                </div>
                <span class="cart-item-size-badge">${item.size} • Eau de Parfum</span>
                <div class="cart-item-bottom">
                    <div class="cart-item-qty-selector">
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)">−</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                    </div>
                    <span class="cart-item-price-total">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    `).join('');

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
        shippingEl.innerHTML = summary.shipping === 0 
            ? '<span class="free-shipping-tag">FREE</span>' 
            : `₹${summary.shipping.toLocaleString('en-IN')}`;
    }

    if (totalEl) totalEl.textContent = `₹${summary.grandTotal.toLocaleString('en-IN')}`;

    if (promoBadge) {
        if (summary.promo) {
            promoBadge.style.display = 'inline-flex';
            promoBadge.innerHTML = `<span>🏷️ ${summary.promo.code} applied</span> <button onclick="removePromoCode()">✕</button>`;
            if (promoInput) promoInput.value = '';
        } else {
            promoBadge.style.display = 'none';
        }
    }
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer && overlay) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
