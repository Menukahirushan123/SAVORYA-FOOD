# SAVORYA - Artisan Culinary Kitchen & Gourmet Food Website

A modern, responsive, and feature-rich food website built with pure **HTML5, CSS3, and modern Vanilla JavaScript (ES6+)**.

---

## 🌟 Key Features

1. **Brand & Hero Section**:
   - High-impact culinary presentation with floating badge animations.
   - Quick statistics (ratings, delivery ETA, organic guarantee).
   - Instant call-to-actions ("Explore Menu" and "Book Table").

2. **Chef's Specials & Deals**:
   - Curated highlight dishes with discount tags (e.g. 15–20% OFF).
   - One-click "Add to Cart" and "Quick View".

3. **Interactive Filterable Food Menu**:
   - **Categories**: All Dishes, Burgers, Artisan Pizzas, Bowls & Ramen, Healthy Salads, Desserts, Beverages.
   - **Dietary Filter Chips**: All, Vegetarian 🌿, Spicy 🌶️, Gluten-Free 🌾.
   - **Live Search**: Instant real-time filtering across titles, descriptions, and ingredients.
   - **Sorting**: Recommended, Highest Rated, Price (Low to High), Price (High to Low), Lowest Calories.
   - **Favorites / Wishlist**: Heart toggle on any dish with dedicated Wishlist modal.

4. **Interactive Slide-Out Cart**:
   - Free delivery progress meter (dynamic threshold progress bar).
   - Quantity increment / decrement and item removal.
   - Special preparation notes per item.
   - **Promo Coupon System**: Test codes like `YUMMY20` (20% off) and `FREESHIP` (Free delivery).
   - Transparent subtotal, tax (8%), delivery fee, and discount breakdown.
   - Persistent basket saved in browser `localStorage`.

5. **Dish Quick View Modal**:
   - Full high-resolution dish imagery.
   - Nutrition facts (protein, carbs, fat, calories).
   - Fresh ingredient breakdown chips.
   - Kitchen instructions text input.

6. **Complete Checkout Experience**:
   - Delivery address, phone, and delivery notes.
   - Payment method toggle (Credit/Debit Card, Apple/Google Pay, Cash on Delivery).
   - Instant order confirmation modal with simulated live order status tracker (`#SAV-XXXXX`).

7. **Table Reservation System**:
   - Date picker, guest size selector (1 to 8+ people), time slot, and seating preference (Main Hall, Garden Patio, Romantic Booth, Chef Counter).
   - Interactive confirmation dialog with booking reference (`#RES-XXXX`).

8. **Design & Responsiveness**:
   - Premium culinary dark aesthetic with warm terracotta orange (`#ff5a22`) and amber accents.
   - Mobile responsive navigation with slide-in hamburger drawer.
   - Non-intrusive toast notification alerts.

---

## 📂 File Structure

```text
test/
├── index.html          # Main HTML structure with semantic sections & modals
├── css/
│   └── style.css       # Complete CSS design system, typography, animations & media queries
├── js/
│   ├── data.js         # Menu database, categories, promo codes & customer reviews
│   └── app.js          # Cart logic, filters, modals, checkout & reservation handlers
└── README.md           # Documentation & quick start guide
```

---

## 🚀 How to Run the Website

### Option 1: Direct in Browser
Simply double-click `index.html` or right-click and choose **Open with > Chrome / Edge / Firefox**.

### Option 2: Using Node.js (Local Server)
Run in PowerShell:
```powershell
npx serve .
```
or open directly:
```powershell
start index.html
```

---

## 🏷️ Test Promo Codes
- `YUMMY20` : 20% off entire order
- `FREESHIP`: Unlocks free delivery
- `TASTY10` : $10 off orders over $30
