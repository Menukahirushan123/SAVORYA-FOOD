/**
 * SAVORYA - Modern Artisan Food Website
 * Core Application Logic: State Management, Cart, Search, Filters, Modals, Checkout & Reservations
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== STATE ====================
  const state = {
    cart: JSON.parse(localStorage.getItem('savorya_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('savorya_wishlist')) || [],
    activeCategory: 'all',
    activeDiet: 'all',
    searchQuery: '',
    sortBy: 'recommended',
    appliedPromo: null,
    quickViewItem: null,
    quickViewQty: 1
  };

  const TAX_RATE = 0.08;
  const STANDARD_DELIVERY_FEE = 3.99;
  const FREE_DELIVERY_THRESHOLD = 35.00;

  // ==================== DOM ELEMENTS ====================
  // Navigation & Search
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchOverlayBar = document.getElementById('search-overlay-bar');
  const globalSearchInput = document.getElementById('global-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');

  // Menu Controls
  const categoryTabs = document.getElementById('category-tabs');
  const menuSearchInput = document.getElementById('menu-search-input');
  const menuClearSearch = document.getElementById('menu-clear-search');
  const dietaryChips = document.querySelectorAll('.dietary-chip');
  const sortSelect = document.getElementById('sort-select');
  const dishesGrid = document.getElementById('dishes-grid');
  const emptyMenuState = document.getElementById('empty-menu-state');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const resultsCountText = document.getElementById('results-count-text');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const specialsGrid = document.getElementById('specials-grid');
  const reviewsGrid = document.getElementById('reviews-grid');

  // Cart Elements
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartFooter = document.getElementById('cart-footer');
  const cartCountBadges = [document.getElementById('cart-count'), document.getElementById('cart-items-total-qty')];
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountEl = document.getElementById('cart-discount');
  const discountRow = document.getElementById('discount-row');
  const cartTaxEl = document.getElementById('cart-tax');
  const cartDeliveryEl = document.getElementById('cart-delivery');
  const cartGrandTotalEl = document.getElementById('cart-grand-total');
  const checkoutBtnTotal = document.getElementById('checkout-btn-total');
  const deliveryTrackerMsg = document.getElementById('delivery-tracker-msg');
  const deliveryProgressFill = document.getElementById('delivery-progress-fill');
  const couponInput = document.getElementById('coupon-input');
  const btnApplyCoupon = document.getElementById('btn-apply-coupon');
  const appliedCouponTag = document.getElementById('applied-coupon-tag');
  const appliedCouponText = document.getElementById('applied-coupon-text');
  const removeCouponBtn = document.getElementById('remove-coupon-btn');
  const emptyCartExploreBtn = document.getElementById('empty-cart-explore-btn');

  // Wishlist Elements
  const wishlistBtn = document.getElementById('wishlist-btn');
  const wishlistModal = document.getElementById('wishlist-modal');
  const wishlistCloseBtn = document.getElementById('wishlist-close-btn');
  const wishlistCountBadge = document.getElementById('wishlist-count');
  const modalWishlistCount = document.getElementById('modal-wishlist-count');
  const wishlistItemsContainer = document.getElementById('wishlist-items-container');

  // Quick View Modal
  const quickviewModal = document.getElementById('quickview-modal');
  const quickviewCloseBtn = document.getElementById('quickview-close-btn');
  const qvImage = document.getElementById('qv-image');
  const qvBadge = document.getElementById('qv-badge');
  const qvTitle = document.getElementById('qv-title');
  const qvRating = document.getElementById('qv-rating');
  const qvPrice = document.getElementById('qv-price');
  const qvOrigPrice = document.getElementById('qv-orig-price');
  const qvCalories = document.getElementById('qv-calories');
  const qvPrepTime = document.getElementById('qv-preptime');
  const qvDescription = document.getElementById('qv-description');
  const qvProtein = document.getElementById('qv-protein');
  const qvCarbs = document.getElementById('qv-carbs');
  const qvFat = document.getElementById('qv-fat');
  const qvIngredientsList = document.getElementById('qv-ingredients-list');
  const qvSpecialNotes = document.getElementById('qv-special-notes');
  const qvQtyMinus = document.getElementById('qv-qty-minus');
  const qvQtyPlus = document.getElementById('qv-qty-plus');
  const qvQtyVal = document.getElementById('qv-qty-val');
  const qvAddToCartBtn = document.getElementById('qv-add-to-cart-btn');
  const qvAddTotal = document.getElementById('qv-add-total');

  // Checkout Elements
  const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutCloseBtn = document.getElementById('checkout-close-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const coItemsList = document.getElementById('co-items-list');
  const coSubtotal = document.getElementById('co-subtotal');
  const coDiscountRow = document.getElementById('co-discount-row');
  const coDiscount = document.getElementById('co-discount');
  const coTax = document.getElementById('co-tax');
  const coDelivery = document.getElementById('co-delivery');
  const coTotal = document.getElementById('co-total');
  const orderSuccessModal = document.getElementById('order-success-modal');
  const closeSuccessModalBtn = document.getElementById('close-success-modal-btn');
  const confirmedOrderId = document.getElementById('confirmed-order-id');

  // Reservation Elements
  const reservationForm = document.getElementById('reservation-form');
  const reservationSuccessModal = document.getElementById('reservation-success-modal');
  const closeResModalBtn = document.getElementById('close-res-modal-btn');
  const resConfirmedDetails = document.getElementById('res-confirmed-details');
  const resDateInput = document.getElementById('res-date');

  // Newsletter Element
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // Set default minimum date for reservation (today)
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.min = today;
    resDateInput.value = today;
  }

  // ==================== INITIALIZATION ====================
  function init() {
    renderCategoryTabs();
    renderSpecials();
    renderDishes();
    renderReviews();
    updateCartUI();
    updateWishlistUI();
    setupEventListeners();
  }

  // ==================== RENDERING FUNCTIONS ====================

  /**
   * Render category filter tabs
   */
  function renderCategoryTabs() {
    categoryTabs.innerHTML = CATEGORIES.map(cat => `
      <button class="category-pill ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.name}</span>
      </button>
    `).join('');
  }

  /**
   * Render Chef's Specials / Discount highlights
   */
  function renderSpecials() {
    const specials = MENU_ITEMS.filter(item => item.originalPrice || item.badge.includes('Special')).slice(0, 4);
    specialsGrid.innerHTML = specials.map(item => {
      const discountPercentage = item.originalPrice 
        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
        : 15;
      
      const isFav = state.wishlist.includes(item.id);

      return `
        <div class="special-card">
          <div class="special-card-img-wrap">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <span class="special-discount-tag">${discountPercentage}% OFF</span>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${item.id}" aria-label="Save to favorites">
              <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
          <div class="special-card-body">
            <div class="special-card-meta">
              <span class="card-rating"><i class="fa-solid fa-star"></i> ${item.rating} (${item.reviewCount})</span>
              <span class="card-cal"><i class="fa-solid fa-fire text-amber"></i> ${item.calories} kcal</span>
            </div>
            <h3 class="special-card-title">${item.name}</h3>
            <p class="special-card-desc">${item.description}</p>
            <div class="special-card-footer">
              <div class="price-box">
                <span class="current-price">$${item.price.toFixed(2)}</span>
                ${item.originalPrice ? `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <div class="dish-actions">
                <button class="btn-quick-view" data-qv-id="${item.id}">Details</button>
                <button class="btn-icon-add" data-add-id="${item.id}" title="Add to Cart" aria-label="Add ${item.name} to Cart">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Filter, sort, and render full menu items
   */
  function renderDishes() {
    let filtered = [...MENU_ITEMS];

    // Filter by category
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === state.activeCategory);
    }

    // Filter by dietary requirement
    if (state.activeDiet === 'veg') {
      filtered = filtered.filter(item => item.isVeg);
    } else if (state.activeDiet === 'spicy') {
      filtered = filtered.filter(item => item.isSpicy);
    } else if (state.activeDiet === 'glutenFree') {
      filtered = filtered.filter(item => item.isGlutenFree);
    }

    // Filter by search query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Sort items
    if (state.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'calories') {
      filtered.sort((a, b) => a.calories - b.calories);
    }

    // Update results indicator
    const isFiltered = state.activeCategory !== 'all' || state.activeDiet !== 'all' || state.searchQuery !== '';
    resetFiltersBtn.style.display = isFiltered ? 'inline-flex' : 'none';
    resultsCountText.textContent = `Showing ${filtered.length} of ${MENU_ITEMS.length} dishes`;

    if (filtered.length === 0) {
      dishesGrid.innerHTML = '';
      emptyMenuState.style.display = 'block';
      return;
    }

    emptyMenuState.style.display = 'none';

    dishesGrid.innerHTML = filtered.map(dish => {
      const isFav = state.wishlist.includes(dish.id);
      return `
        <div class="dish-card">
          <div class="dish-img-wrap">
            <img src="${dish.image}" alt="${dish.name}" loading="lazy">
            <span class="dish-tag-badge">${dish.badge}</span>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${dish.id}" aria-label="Toggle favorite">
              <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
          <div class="dish-content">
            <div class="dish-meta-row">
              <span class="card-rating"><i class="fa-solid fa-star"></i> ${dish.rating} (${dish.reviewCount})</span>
              <span><i class="fa-regular fa-clock"></i> ${dish.prepTime}</span>
              <span><i class="fa-solid fa-fire text-amber"></i> ${dish.calories} cal</span>
            </div>
            <h3 class="dish-title">${dish.name}</h3>
            <p class="dish-desc">${dish.description}</p>
            <div class="dish-footer">
              <div class="price-box">
                <span class="current-price">$${dish.price.toFixed(2)}</span>
                ${dish.originalPrice ? `<span class="original-price">$${dish.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <div class="dish-actions">
                <button class="btn-quick-view" data-qv-id="${dish.id}">View</button>
                <button class="btn-icon-add" data-add-id="${dish.id}" title="Add to Cart" aria-label="Add ${dish.name} to Cart">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render customer reviews
   */
  function renderReviews() {
    reviewsGrid.innerHTML = REVIEWS.map(r => `
      <div class="review-card">
        <div class="review-card-stars">
          ${Array(r.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
        </div>
        <p class="review-card-quote">"${r.text}"</p>
        <div class="review-card-user">
          <img src="${r.avatar}" alt="${r.name}" class="user-avatar" loading="lazy">
          <div class="user-info">
            <h5>${r.name}</h5>
            <span class="user-role">${r.role}</span>
          </div>
          <span class="user-dish-badge"><i class="fa-solid fa-utensils"></i> ${r.dish}</span>
        </div>
      </div>
    `).join('');
  }

  // ==================== CART OPERATIONS ====================

  /**
   * Add item to cart
   */
  function addToCart(itemId, quantity = 1, specialNotes = '') {
    const item = MENU_ITEMS.find(m => m.id === itemId);
    if (!item) return;

    const existingIndex = state.cart.findIndex(c => c.id === itemId && c.specialNotes === specialNotes);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: itemId,
        quantity: quantity,
        specialNotes: specialNotes
      });
    }

    saveCart();
    updateCartUI();
    showToast(`Added <strong>${quantity}x ${item.name}</strong> to your order!`, 'success');
  }

  /**
   * Modify item quantity
   */
  function updateCartItemQty(index, change) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += change;

    if (state.cart[index].quantity <= 0) {
      const removedItem = MENU_ITEMS.find(m => m.id === state.cart[index].id);
      state.cart.splice(index, 1);
      if (removedItem) showToast(`Removed ${removedItem.name} from basket`, 'info');
    }

    saveCart();
    updateCartUI();
  }

  /**
   * Remove item directly
   */
  function removeCartItem(index) {
    if (!state.cart[index]) return;
    const removedItem = MENU_ITEMS.find(m => m.id === state.cart[index].id);
    state.cart.splice(index, 1);
    saveCart();
    updateCartUI();
    if (removedItem) showToast(`Removed ${removedItem.name}`, 'info');
  }

  /**
   * Save cart to localStorage
   */
  function saveCart() {
    localStorage.setItem('savorya_cart', JSON.stringify(state.cart));
  }

  /**
   * Calculate totals and refresh cart UI
   */
  function updateCartUI() {
    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(badge => {
      if (badge) badge.textContent = totalQty;
    });

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-state" id="empty-cart-state">
          <div class="empty-cart-icon"><i class="fa-solid fa-basket-shopping"></i></div>
          <h4>Your basket is empty</h4>
          <p>Explore our menu and add something delicious to your order!</p>
          <button class="btn btn-primary btn-sm" id="empty-cart-explore-btn">Browse Menu</button>
        </div>
      `;
      cartFooter.style.display = 'none';

      // Reset delivery tracker
      deliveryTrackerMsg.innerHTML = `Add <strong>$${FREE_DELIVERY_THRESHOLD.toFixed(2)}</strong> more to unlock <strong>FREE Delivery!</strong>`;
      deliveryProgressFill.style.width = '0%';
      return;
    }

    cartFooter.style.display = 'block';

    // Render items
    cartItemsContainer.innerHTML = state.cart.map((cartEntry, idx) => {
      const dish = MENU_ITEMS.find(m => m.id === cartEntry.id);
      if (!dish) return '';
      const itemTotal = (dish.price * cartEntry.quantity).toFixed(2);

      return `
        <div class="cart-item">
          <img src="${dish.image}" alt="${dish.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${dish.name}</h4>
            <div class="cart-item-price">$${itemTotal} <span style="font-size:0.75rem; color:var(--color-text-dim); font-weight:normal;">($${dish.price.toFixed(2)} each)</span></div>
            ${cartEntry.specialNotes ? `<div style="font-size:0.72rem; color:var(--color-secondary); margin-top:2px;"><i class="fa-solid fa-note-sticky"></i> Note: ${cartEntry.specialNotes}</div>` : ''}
          </div>
          <div class="cart-item-actions">
            <div class="qty-stepper">
              <button class="btn-qty" data-cart-minus="${idx}" aria-label="Decrease quantity">-</button>
              <span class="qty-number">${cartEntry.quantity}</span>
              <button class="btn-qty" data-cart-plus="${idx}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item-remove" data-cart-remove="${idx}" title="Remove item" aria-label="Remove item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Calculations
    const subtotal = state.cart.reduce((sum, item) => {
      const dish = MENU_ITEMS.find(m => m.id === item.id);
      return sum + (dish ? dish.price * item.quantity : 0);
    }, 0);

    // Free delivery progress
    const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
    const progressPercent = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
    deliveryProgressFill.style.width = `${progressPercent}%`;

    if (remainingForFreeDelivery === 0) {
      deliveryTrackerMsg.innerHTML = `<span class="text-green"><i class="fa-solid fa-circle-check"></i> Congratulations! You've unlocked <strong>FREE Delivery!</strong></span>`;
    } else {
      deliveryTrackerMsg.innerHTML = `Add <strong>$${remainingForFreeDelivery.toFixed(2)}</strong> more to unlock <strong>FREE Delivery!</strong>`;
    }

    // Delivery fee
    let deliveryFee = STANDARD_DELIVERY_FEE;
    if (subtotal >= FREE_DELIVERY_THRESHOLD || (state.appliedPromo && state.appliedPromo.type === 'delivery')) {
      deliveryFee = 0;
    }

    // Discount Calculation
    let discountAmount = 0;
    if (state.appliedPromo) {
      if (state.appliedPromo.type === 'percent') {
        discountAmount = subtotal * state.appliedPromo.discount;
      } else if (state.appliedPromo.type === 'flat') {
        if (!state.appliedPromo.minOrder || subtotal >= state.appliedPromo.minOrder) {
          discountAmount = state.appliedPromo.discount;
        } else {
          showToast(`Coupon requires a minimum order of $${state.appliedPromo.minOrder}`, 'warning');
          state.appliedPromo = null;
        }
      }
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = taxableAmount * TAX_RATE;
    const grandTotal = Math.max(0, taxableAmount + tax + deliveryFee);

    // Update Elements
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartTaxEl.textContent = `$${tax.toFixed(2)}`;
    cartDeliveryEl.innerHTML = deliveryFee === 0 ? '<span class="text-green">FREE</span>' : `$${deliveryFee.toFixed(2)}`;
    cartGrandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
    checkoutBtnTotal.textContent = `$${grandTotal.toFixed(2)}`;

    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      cartDiscountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.style.display = 'none';
    }

    // Promo code tags
    if (state.appliedPromo) {
      appliedCouponTag.style.display = 'flex';
      appliedCouponText.innerHTML = `<i class="fa-solid fa-tag"></i> <strong>${state.appliedPromo.code}</strong> applied (${state.appliedPromo.desc})`;
    } else {
      appliedCouponTag.style.display = 'none';
    }
  }

  /**
   * Apply coupon code
   */
  function applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    if (PROMO_CODES[cleanCode]) {
      state.appliedPromo = {
        code: cleanCode,
        ...PROMO_CODES[cleanCode]
      };
      showToast(`Promo <strong>${cleanCode}</strong> applied successfully!`, 'success');
      couponInput.value = '';
      updateCartUI();
    } else {
      showToast(`Invalid promo code "${cleanCode}". Try YUMMY20!`, 'warning');
    }
  }

  // ==================== WISHLIST OPERATIONS ====================

  function toggleWishlist(itemId) {
    const index = state.wishlist.indexOf(itemId);
    const item = MENU_ITEMS.find(m => m.id === itemId);

    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast(`Removed ${item ? item.name : 'dish'} from favorites`, 'info');
    } else {
      state.wishlist.push(itemId);
      showToast(`Saved <strong>${item ? item.name : 'dish'}</strong> to favorites!`, 'success');
    }

    localStorage.setItem('savorya_wishlist', JSON.stringify(state.wishlist));
    updateWishlistUI();
    renderDishes();
    renderSpecials();
  }

  function updateWishlistUI() {
    const count = state.wishlist.length;
    if (wishlistCountBadge) wishlistCountBadge.textContent = count;
    if (modalWishlistCount) modalWishlistCount.textContent = count;

    if (count === 0) {
      wishlistItemsContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; color:var(--color-text-muted);">
          <i class="fa-regular fa-heart" style="font-size:3rem; margin-bottom:12px; color:var(--color-text-dim);"></i>
          <h4>No favorites saved yet</h4>
          <p style="font-size:0.88rem; margin-top:6px;">Click the heart icon on any dish to save it here for quick ordering!</p>
        </div>
      `;
      return;
    }

    wishlistItemsContainer.innerHTML = state.wishlist.map(id => {
      const dish = MENU_ITEMS.find(m => m.id === id);
      if (!dish) return '';

      return `
        <div class="wishlist-item">
          <img src="${dish.image}" alt="${dish.name}">
          <div class="wishlist-item-info">
            <h4 class="wishlist-item-title">${dish.name}</h4>
            <span class="wishlist-item-price">$${dish.price.toFixed(2)}</span>
          </div>
          <div class="wishlist-item-actions">
            <button class="btn btn-primary btn-sm" data-wishlist-add="${dish.id}">
              <i class="fa-solid fa-cart-plus"></i> Add
            </button>
            <button class="cart-item-remove" data-wishlist-remove="${dish.id}" title="Remove">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==================== QUICK VIEW MODAL ====================

  function openQuickView(itemId) {
    const item = MENU_ITEMS.find(m => m.id === itemId);
    if (!item) return;

    state.quickViewItem = item;
    state.quickViewQty = 1;

    qvImage.src = item.image;
    qvBadge.textContent = item.badge;
    qvTitle.textContent = item.name;
    qvRating.innerHTML = `<i class="fa-solid fa-star"></i> <span>${item.rating} (${item.reviewCount} customer reviews)</span>`;
    qvPrice.textContent = `$${item.price.toFixed(2)}`;
    qvOrigPrice.textContent = item.originalPrice ? `$${item.originalPrice.toFixed(2)}` : '';
    qvOrigPrice.style.display = item.originalPrice ? 'inline' : 'none';
    qvCalories.textContent = `${item.calories} kcal`;
    qvPrepTime.textContent = item.prepTime;
    qvDescription.textContent = item.description;

    qvProtein.textContent = item.nutrition.protein;
    qvCarbs.textContent = item.nutrition.carbs;
    qvFat.textContent = item.nutrition.fat;

    qvIngredientsList.innerHTML = item.ingredients.map(ing => `
      <span class="ingredient-pill">${ing}</span>
    `).join('');

    qvSpecialNotes.value = '';
    qvQtyVal.textContent = state.quickViewQty;
    updateQuickViewTotal();

    quickviewModal.classList.add('active');
  }

  function updateQuickViewTotal() {
    if (!state.quickViewItem) return;
    const total = (state.quickViewItem.price * state.quickViewQty).toFixed(2);
    qvAddTotal.textContent = `$${total}`;
  }

  function closeQuickView() {
    quickviewModal.classList.remove('active');
    state.quickViewItem = null;
  }

  // ==================== CHECKOUT FLOW ====================

  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast('Your order basket is currently empty!', 'warning');
      return;
    }

    // Close cart drawer
    closeCart();

    // Populate checkout items summary
    coItemsList.innerHTML = state.cart.map(c => {
      const dish = MENU_ITEMS.find(m => m.id === c.id);
      if (!dish) return '';
      return `
        <div class="co-item-line">
          <span class="co-item-name">${c.quantity}x ${dish.name}</span>
          <span class="co-item-price">$${(dish.price * c.quantity).toFixed(2)}</span>
        </div>
      `;
    }).join('');

    // Replicate totals
    const subtotal = state.cart.reduce((sum, item) => {
      const dish = MENU_ITEMS.find(m => m.id === item.id);
      return sum + (dish ? dish.price * item.quantity : 0);
    }, 0);

    let deliveryFee = STANDARD_DELIVERY_FEE;
    if (subtotal >= FREE_DELIVERY_THRESHOLD || (state.appliedPromo && state.appliedPromo.type === 'delivery')) {
      deliveryFee = 0;
    }

    let discountAmount = 0;
    if (state.appliedPromo) {
      if (state.appliedPromo.type === 'percent') {
        discountAmount = subtotal * state.appliedPromo.discount;
      } else if (state.appliedPromo.type === 'flat') {
        discountAmount = state.appliedPromo.discount;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = taxableAmount * TAX_RATE;
    const grandTotal = Math.max(0, taxableAmount + tax + deliveryFee);

    coSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    coTax.textContent = `$${tax.toFixed(2)}`;
    coDelivery.innerHTML = deliveryFee === 0 ? '<span class="text-green">FREE</span>' : `$${deliveryFee.toFixed(2)}`;
    coTotal.textContent = `$${grandTotal.toFixed(2)}`;

    if (discountAmount > 0) {
      coDiscountRow.style.display = 'flex';
      coDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      coDiscountRow.style.display = 'none';
    }

    checkoutModal.classList.add('active');
  }

  function handleOrderPlacement(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('co-submit-order-btn');
    const originalContent = submitBtn.innerHTML;

    // Simulated payment processing
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authorizing Payment...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;

      // Generate order ID
      const orderId = '#SAV-' + Math.floor(10000 + Math.random() * 90000);
      confirmedOrderId.textContent = orderId;

      // Close checkout and open success
      checkoutModal.classList.remove('active');
      orderSuccessModal.classList.add('active');

      // Clear cart
      state.cart = [];
      state.appliedPromo = null;
      saveCart();
      updateCartUI();

      showToast(`Order ${orderId} confirmed! Our kitchen is cooking.`, 'success');
    }, 1200);
  }

  // ==================== TABLE RESERVATIONS ====================

  function handleReservation(e) {
    e.preventDefault();

    const name = document.getElementById('res-name').value;
    const guests = document.getElementById('res-guests').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const seating = document.querySelector('input[name="seating"]:checked')?.value || 'Main Dining Hall';
    const resId = 'RES-' + Math.floor(1000 + Math.random() * 9000);

    resConfirmedDetails.innerHTML = `
      <div class="res-row"><span>Booking Reference:</span> <strong>#${resId}</strong></div>
      <div class="res-row"><span>Guest Name:</span> <strong>${name}</strong></div>
      <div class="res-row"><span>Party Size:</span> <strong>${guests} Person(s)</strong></div>
      <div class="res-row"><span>Date & Time:</span> <strong>${date} at ${time}</strong></div>
      <div class="res-row"><span>Seating Preference:</span> <strong>${seating}</strong></div>
    `;

    reservationSuccessModal.classList.add('active');
    reservationForm.reset();

    // Re-set default date
    const today = new Date().toISOString().split('T')[0];
    resDateInput.value = today;

    showToast(`Table confirmed for ${name}! Reference #${resId}`, 'success');
  }

  // ==================== TOAST NOTIFICATIONS ====================

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-circle-check';
    if (type === 'info') icon = 'fa-circle-info';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <div class="toast-icon text-amber"><i class="fa-solid ${icon}"></i></div>
      <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // ==================== CART DRAWER TOGGLE ====================

  function openCart() {
    cartSidebar.classList.add('active');
    cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('active');
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ==================== EVENT LISTENERS SETUP ====================

  function setupEventListeners() {
    // Window scroll for sticky header shadow
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Mobile Hamburger
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close mobile nav when clicking any link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    // Header Quick Search Toggle
    searchToggleBtn.addEventListener('click', () => {
      searchOverlayBar.classList.toggle('active');
      if (searchOverlayBar.classList.contains('active')) {
        globalSearchInput.focus();
      }
    });

    closeSearchBtn.addEventListener('click', () => {
      searchOverlayBar.classList.remove('active');
    });

    globalSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      clearSearchBtn.style.display = val ? 'block' : 'none';
      state.searchQuery = val;
      menuSearchInput.value = val;
      renderDishes();
      // Smooth scroll to menu section if not there
      const menuSec = document.getElementById('menu');
      if (menuSec && val.length > 2) {
        menuSec.scrollIntoView({ behavior: 'smooth' });
      }
    });

    clearSearchBtn.addEventListener('click', () => {
      globalSearchInput.value = '';
      clearSearchBtn.style.display = 'none';
      state.searchQuery = '';
      menuSearchInput.value = '';
      renderDishes();
    });

    // Menu Section Search Input
    menuSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      menuClearSearch.style.display = val ? 'block' : 'none';
      state.searchQuery = val;
      globalSearchInput.value = val;
      renderDishes();
    });

    menuClearSearch.addEventListener('click', () => {
      menuSearchInput.value = '';
      menuClearSearch.style.display = 'none';
      state.searchQuery = '';
      globalSearchInput.value = '';
      renderDishes();
    });

    // Category Tabs click delegation
    categoryTabs.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (!pill) return;
      categoryTabs.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeCategory = pill.dataset.category;
      renderDishes();
    });

    // Dietary Filter chips
    dietaryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dietaryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.activeDiet = chip.dataset.diet;
        renderDishes();
      });
    });

    // Sort Dropdown
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderDishes();
    });

    // Reset Filters Buttons
    const resetAllFilters = () => {
      state.activeCategory = 'all';
      state.activeDiet = 'all';
      state.searchQuery = '';
      state.sortBy = 'recommended';

      menuSearchInput.value = '';
      globalSearchInput.value = '';
      menuClearSearch.style.display = 'none';
      clearSearchBtn.style.display = 'none';
      sortSelect.value = 'recommended';

      dietaryChips.forEach(c => c.classList.toggle('active', c.dataset.diet === 'all'));
      renderCategoryTabs();
      renderDishes();
    };

    resetFiltersBtn.addEventListener('click', resetAllFilters);
    emptyResetBtn.addEventListener('click', resetAllFilters);

    // Global Add to Cart & Quick View Delegations
    document.addEventListener('click', (e) => {
      // Add to Cart button on dish cards
      const addBtn = e.target.closest('[data-add-id]');
      if (addBtn) {
        const dishId = addBtn.dataset.addId;
        addToCart(dishId, 1);
        return;
      }

      // Quick View button
      const qvBtn = e.target.closest('[data-qv-id]');
      if (qvBtn) {
        const dishId = qvBtn.dataset.qvId;
        openQuickView(dishId);
        return;
      }

      // Favorite toggle button
      const favBtn = e.target.closest('[data-fav-id]');
      if (favBtn) {
        const dishId = favBtn.dataset.favId;
        toggleWishlist(dishId);
        return;
      }

      // Quick Promo Pill click
      const promoPill = e.target.closest('.quick-promo-pill');
      if (promoPill) {
        applyCoupon(promoPill.dataset.code);
        return;
      }

      // Wishlist Modal items: Add to cart
      const wishAdd = e.target.closest('[data-wishlist-add]');
      if (wishAdd) {
        addToCart(wishAdd.dataset.wishlistAdd, 1);
        return;
      }

      // Wishlist Modal items: Remove
      const wishRemove = e.target.closest('[data-wishlist-remove]');
      if (wishRemove) {
        toggleWishlist(wishRemove.dataset.wishlistRemove);
        return;
      }

      // Footer Category Links
      const footerCat = e.target.closest('[data-category-target]');
      if (footerCat) {
        e.preventDefault();
        const targetCategory = footerCat.dataset.categoryTarget;
        state.activeCategory = targetCategory;
        renderCategoryTabs();
        renderDishes();
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Empty Cart Explore button
      if (e.target.id === 'empty-cart-explore-btn') {
        closeCart();
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        return;
      }
    });

    // Cart Sidebar controls
    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartBackdrop.addEventListener('click', closeCart);

    // Cart Item steppers & remove delegation
    cartItemsContainer.addEventListener('click', (e) => {
      const minusBtn = e.target.closest('[data-cart-minus]');
      if (minusBtn) {
        updateCartItemQty(parseInt(minusBtn.dataset.cartMinus), -1);
        return;
      }

      const plusBtn = e.target.closest('[data-cart-plus]');
      if (plusBtn) {
        updateCartItemQty(parseInt(plusBtn.dataset.cartPlus), 1);
        return;
      }

      const removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        removeCartItem(parseInt(removeBtn.dataset.cartRemove));
        return;
      }
    });

    // Coupon button in cart
    btnApplyCoupon.addEventListener('click', () => {
      applyCoupon(couponInput.value);
    });

    couponInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        applyCoupon(couponInput.value);
      }
    });

    removeCouponBtn.addEventListener('click', () => {
      state.appliedPromo = null;
      updateCartUI();
      showToast('Coupon removed', 'info');
    });

    // Wishlist Modal
    wishlistBtn.addEventListener('click', () => {
      updateWishlistUI();
      wishlistModal.classList.add('active');
    });

    wishlistCloseBtn.addEventListener('click', () => {
      wishlistModal.classList.remove('active');
    });

    // Quick View Controls
    quickviewCloseBtn.addEventListener('click', closeQuickView);

    qvQtyMinus.addEventListener('click', () => {
      if (state.quickViewQty > 1) {
        state.quickViewQty--;
        qvQtyVal.textContent = state.quickViewQty;
        updateQuickViewTotal();
      }
    });

    qvQtyPlus.addEventListener('click', () => {
      state.quickViewQty++;
      qvQtyVal.textContent = state.quickViewQty;
      updateQuickViewTotal();
    });

    qvAddToCartBtn.addEventListener('click', () => {
      if (state.quickViewItem) {
        addToCart(state.quickViewItem.id, state.quickViewQty, qvSpecialNotes.value.trim());
        closeQuickView();
      }
    });

    // Checkout Modal controls
    proceedCheckoutBtn.addEventListener('click', openCheckoutModal);
    checkoutCloseBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
    checkoutForm.addEventListener('submit', handleOrderPlacement);

    // Payment method radio visual feedback
    const payOptions = document.querySelectorAll('.pay-option');
    payOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        payOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const cardFields = document.getElementById('card-fields');
        const isCard = opt.querySelector('input').value === 'card';
        if (cardFields) cardFields.style.display = isCard ? 'flex' : 'none';
      });
    });

    // Order Success Modal close
    closeSuccessModalBtn.addEventListener('click', () => {
      orderSuccessModal.classList.remove('active');
    });

    // Reservation Form
    reservationForm.addEventListener('submit', handleReservation);
    closeResModalBtn.addEventListener('click', () => {
      reservationSuccessModal.classList.remove('active');
    });

    // Newsletter Form
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value;
      showToast(`Welcome to the Savorya Club! Check <strong>${email}</strong> for your 20% coupon: <strong>YUMMY20</strong>`, 'success');
      newsletterForm.reset();
    });

    // Close modals on clicking backdrop
    [quickviewModal, checkoutModal, orderSuccessModal, reservationSuccessModal, wishlistModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          if (modal === quickviewModal) state.quickViewItem = null;
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCart();
        closeQuickView();
        checkoutModal.classList.remove('active');
        orderSuccessModal.classList.remove('active');
        reservationSuccessModal.classList.remove('active');
        wishlistModal.classList.remove('active');
        searchOverlayBar.classList.remove('active');
      }
    });
  }

  // Run App
  init();
});
