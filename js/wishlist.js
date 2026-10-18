// ===================================================
// GOLDEN BLISS - WISHLIST CONTROLLER
// ===================================================

let wishlist = JSON.parse(localStorage.getItem('goldenbliss_wishlist')) || [];

function saveWishlist() {
    localStorage.setItem('goldenbliss_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function toggleWishlist(productId) {
    const id = String(productId);
    const product = getPerfumeById(id);
    if (!product) return;

    const index = wishlist.indexOf(id);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removed from Wishlist', `${product.name} removed from your favorites.`, 'heart-off');
    } else {
        wishlist.push(id);
        showToast('Saved to Wishlist ❤️', `${product.name} added to your private wishlist.`, 'heart');
    }

    saveWishlist();
}

function isInWishlist(productId) {
    return wishlist.includes(String(productId));
}

function updateWishlistUI() {
    // Update navbar badges
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(badge => {
        badge.textContent = wishlist.length;
        badge.style.display = wishlist.length > 0 ? 'inline-flex' : 'none';
    });

    // Update heart icons across the website
    const heartButtons = document.querySelectorAll('.wishlist-toggle-btn');
    heartButtons.forEach(btn => {
        const id = btn.dataset.productId;
        if (isInWishlist(id)) {
            btn.classList.add('active');
            btn.innerHTML = '❤️';
            btn.setAttribute('aria-label', 'Remove from Wishlist');
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '♡';
            btn.setAttribute('aria-label', 'Add to Wishlist');
        }
    });

    renderWishlistDrawer();
}

function renderWishlistDrawer() {
    const container = document.getElementById('wishlistDrawerItems');
    const emptyState = document.getElementById('wishlistDrawerEmpty');

    if (!container) return;

    if (wishlist.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = wishlist.map(id => {
        const product = getPerfumeById(id);
        if (!product) return '';
        const defaultPrice = product.sizes[1] ? product.sizes[1].price : product.sizes[0].price;

        return `
            <div class="wishlist-item-row" data-id="${product.id}">
                <div class="wishlist-item-img-wrap">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="wishlist-item-details">
                    <div class="wishlist-item-header">
                        <h4>${product.name}</h4>
                        <button class="wishlist-item-remove-btn" onclick="toggleWishlist('${product.id}')" title="Remove">✕</button>
                    </div>
                    <span class="wishlist-item-family">${product.family.toUpperCase()} • ${product.gender.toUpperCase()}</span>
                    <div class="wishlist-item-bottom">
                        <span class="wishlist-item-price">₹${defaultPrice.toLocaleString('en-IN')}</span>
                        <button class="wishlist-move-cart-btn" onclick="addToCart('${product.id}', '${product.defaultSize}', 1); toggleWishlist('${product.id}');">
                            🛒 Add to Bag
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer && overlay) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
