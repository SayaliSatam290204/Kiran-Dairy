# 🚀 SHOP DEMO - QUICK START GUIDE

## Pre-Demo Setup (5 minutes)

### 1. Start Services
```bash
# Terminal 1 - Start Backend
cd server
npm install (if needed)
npm start
# Expected output: Server running on port [your_port]

# Terminal 2 - Start Frontend  
cd client
npm install (if needed)
npm run dev
# Expected output: Local: http://localhost:5173
```

### 2. Database Check
```bash
# Verify data exists:
mongosh
use kiran_dairy

# Check shops
db.shops.countDocuments()  # Should be > 0

# Check products
db.products.countDocuments()  # Should be > 0

# Check inventory
db.inventories.countDocuments()  # Should be > 0

# Check received dispatches
db.dispatches.find({ status: "received" }).count()  # Should be > 0

# Check at least one sale
db.sales.countDocuments()  # Should be > 0

exit
```

### 3. Open Browser
```
URL: http://localhost:5173
Expected: Login page loads
```

---

## Demo Execution (15 minutes)

### Phase 1: LOGIN (1 minute)
```
STEP: Click email field
ENTER: demo@shop.com (or any shop email)

STEP: Click password field
ENTER: [shop password]

STEP: Click Login button

EXPECT: Redirected to /shop/dashboard
EXPECT: See "Shop Dashboard" title
EXPECT: See stats cards loading
```

**Talking Point:** 
> "Shop manager logs in with their credentials..."

---

### Phase 2: DASHBOARD OVERVIEW (3 minutes)

**SECTION 1 - Stats Overview**
```
SHOW: 
├─ Total Inventory: [number] units
├─ Daily Sales: [number] transactions
├─ Total Revenue: ₹[amount]
├─ Returns: [number] pending
└─ Staff: [active]/[total]

TALK:
"The shop manager can see at a glance:
- What inventory they have
- Today's sales count
- Revenue earned today
- Any pending returns or staff issues"
```

**SECTION 2 - Recently Received Stock (KEY!)**
```
SCROLL DOWN to "Recently Received Stock" section

SHOW: 
├─ Dispatch Number (e.g., DISP-2026-00145)
├─ Received Date (e.g., 28-Feb-2026)
├─ Confirmed by (e.g., Admin Manager)
└─ Products and quantities:
   ├─ Milk 1L - 100 units @ ₹50
   ├─ Paneer - 50 units @ ₹250
   └─ Yogurt - 75 units @ ₹30

TALK (KEY POINT):
"Here is what's unique - the shop can see EXACTLY 
what products and quantities were received from Admin.
Each dispatch is itemized, so they know exactly 
what came in, when it arrived, and who confirmed it.

This is real-time visibility into their supply."
```

**SECTION 3 - Quick Actions**
```
SHOW: 4 action buttons:
- Start Sale (blue)
- View Inventory (green)  
- 📦 Confirm Dispatch (purple) ← NEW
- Manage Returns (red)

TALK:
"From here, the shop manager can quickly access
all the main functions they need."
```

---

### Phase 3: VIEW INVENTORY (2 minutes)

**STEP 1: Click "View Inventory" button**
```
EXPECT: Navigate to /shop/inventory page
EXPECT: Page loads with summary cards
```

**STEP 2: Show Summary Cards**
```
SHOW:
├─ Total Products: [number]
├─ Total Units: [number]
├─ Low Stock: [number] items (< 5 units)
└─ Out of Stock: [number] items

TALK:
"The summary gives quick insights:
- How many different products we have
- Total units in stock
- What products need attention"
```

**STEP 3: Show Inventory Table**
```
SCROLL DOWN to product table

SHOW columns:
├─ Product Name | SKU | Qty | Price | Status | Category | Last Updated
├─ Milk 1L | MIL001 | 156 | ₹50 | 🟢 IN STOCK | Dairy | [date]
├─ Paneer | PAN001 | 3 | ₹250 | 🟡 LOW STOCK | Dairy | [date]
└─ Yogurt | YOG001 | 0 | ₹30 | 🔴 OUT OF STOCK | Dairy | [date]

POINT TO:
- The quantity column (most important)
- The status badges with colors
- How 🟢 = good, 🟡 = warning, 🔴 = action needed

TALK (KEY POINT):
"This is real-time stock visibility at the shop level.
Notice how:
- GREEN means plenty in stock (5+)
- YELLOW means low stock (< 5)
- RED means out of stock

The shop manager knows exactly what's available
for selling and what needs to be reordered."
```

**STEP 4: Show Stock Information**
```
SCROLL DOWN if not visible

SHOW: "Stock Information" section with:
- 🟢 GREEN: 5+ units available for sale
- 🟡 YELLOW: Less than 5 units remaining (warning)
- 🔴 RED: 0 units - request dispatch from admin
- 💡 System automatically reduces inventory when sold

TALK:
"The color system makes it intuitive for the shop
to know what needs attention without having to
read detailed reports."
```

---

### Phase 4: POS BILLING - SELL PRODUCTS (4 minutes)

**STEP 1: Click "Start Sale" from Dashboard (or go back)**
```
EXPECT: Navigate to /shop/pos page
EXPECT: See two columns:
- Left: Available Products
- Right: Shopping Cart
```

**STEP 2: Select First Product**
```
ACTION: Click on "Milk 1L" product card (left side)

EXPECT: Product appears in cart (right side)
EXPECT: Toast notification: "Added to cart"

SHOW in cart:
├─ Product: Milk 1L
├─ Available Stock: 156
├─ Quantity: 1
├─ Subtotal: ₹50
```

**STEP 3: Increase Quantity**
```
ACTION: Change quantity in cart from 1 to 6

SHOW: 
├─ Quantity: [6]
├─ Stock indicator: "156 available"
└─ Subtotal: ₹300 (6 × ₹50)

TALK:
"As we add quantities, the system checks
against available stock. You can see the
stock amount right there."
```

**STEP 4: Add Second Product**
```
ACTION: Click "Paneer" product (₹250)

EXPECT: Added to cart

SHOW in cart:
├─ Milk 1L: 6 units = ₹300
├─ Paneer: 1 unit = ₹250
└─ TOTAL: ₹550
```

**STEP 5: View Total and Checkout**
```
SHOW: "TOTAL: ₹550" with [Checkout] button

ACTION: Click Checkout button

EXPECT: Modal appears: "Confirm Payment"
```

**STEP 6: Select Payment Method & Complete**
```
SHOW in modal:
├─ Total Amount: ₹550
├─ Payment Method dropdown (default: Cash)
│   ├─ Cash
│   ├─ Card
│   ├─ Online Transfer
│   └─ Cheque
└─ [Complete Payment] button

ACTION: Leave as "Cash"
ACTION: Click "Complete Payment"

EXPECT: Toast: "Sale completed!"
EXPECT: Bill preview modal appears
```

**STEP 7: Show Bill Preview**
```
SHOW: Bill with invoice format:
├─ Bill Date & Number
├─ Items sold:
│  ├─ Milk 1L: 6 × ₹50 = ₹300
│  ├─ Paneer: 1 × ₹250 = ₹250
│  └─ [more items if added]
├─ Subtotal: ₹550
├─ Tax: ₹0
├─ TOTAL: ₹550
├─ Payment Method: CASH
└─ Status: PAID ✓

ACTION: Click "🖨️ Print Bill" (optional)

TALK (KEY POINT):
"The system generates a complete bill 
that can be printed and given to customer.
Behind the scenes, it's recording everything:
- What was sold
- How much revenue
- When it was sold"
```

**STEP 8: Close Bill Modal**
```
ACTION: Click outside modal or X button

EXPECT: Cart is now empty
NOTICE: Both items are now [SOLD OUT] or quantity reduced
```

---

### Phase 5: VERIFY STOCK REDUCTION (2 minutes)

**STEP 1: Navigate Back to Inventory**
```
ACTION: Use sidebar to click "Inventory" OR
        In Sidebar: Navigate to /shop/inventory
        
EXPECT: Inventory page loads
```

**STEP 2: Find the Products We Sold**
```
LOOK for: "Milk 1L" in the product table

SHOW:
BEFORE: Milk 1L | MIL001 | 156 | ₹50 | 🟢 IN STOCK
AFTER:  Milk 1L | MIL001 | 150 | ₹50 | 🟢 IN STOCK
                                ↑
                        Reduced from 156 to 150
                        (6 units sold)

TALK:
"Notice that the inventory has been automatically
updated. We sold 6 units of Milk, and the system
automatically reduced it from 156 to 150.

This happens instantly when the sale is completed.
No manual inventory adjustments needed."
```

**STEP 3: Check Paneer (If quantity was low)**
```
LOOK for: "Paneer" in product table

SHOW:
BEFORE: Paneer | PAN001 | 3 | ₹250 | 🟡 LOW STOCK
AFTER:  Paneer | PAN001 | 2 | ₹250 | 🟡 LOW STOCK
                              ↑
                        We sold 1 unit

TALK:
"Same here - sold 1 Paneer, stock reduced by 1.
The system maintains perfect accuracy."
```

**STEP 4: Check Summary Update**
```
LOOK at: Summary cards at top

Notice if numbers changed from earlier
(if you remember the previous count)

TALK:
"The summary statistics at the top would also
be updating in real-time if we refreshed."
```

---

### Phase 6: DISPATCH CONFIRMATION (2 minutes) [OPTIONAL if time]

**STEP 1: Navigate to Dispatch Confirmation**
```
ACTION: From Dashboard or Sidebar, click 
        "📦 Confirm Dispatch"
        
EXPECT: Navigate to /shop/dispatch page
```

**STEP 2: Show Pending Dispatches**
```
SHOW: List of dispatches with status filters:
├─ All Dispatches
├─ Pending Confirmation
└─ Confirmed Received

LOOK FOR: Pending dispatch

SHOW:
├─ Dispatch Number
├─ Status: "Dispatched" or "Pending"
├─ Items with quantities
└─ [Confirm Receipt] button
```

**STEP 3: Confirm Receipt (Optional)**
```
ACTION: Click [Confirm Receipt] button

EXPECT: Modal appears to add notes

ACTION: (Optional) Add note: "Goods received in good condition"

ACTION: Click "Confirm Receipt"

EXPECT: Toast: "Dispatch confirmed as received!"
EXPECT: Status changes to "Received ✓"
```

**TALK POINT:**
```
"This is how the shop confirms that the dispatch
has actually arrived and been received. They can add
notes about the condition of goods, and everything
is tracked with dates and confirmations."
```

---

## Demo Conclusion (1 minute)

### Summary Talking Point

```
"To summarize what we've just demonstrated:

1. SHOP DASHBOARD
   - Shop managers can see all key metrics at a glance
   - They can see exactly what stock arrived from Admin
   - Each dispatch is itemized and tracked

2. INVENTORY VIEW  
   - Real-time stock visibility
   - Color-coded status (green/yellow/red)
   - Clear overview of what needs attention

3. POINT OF SALE
   - Sells products with stock validation
   - Generates bills automatically
   - Records all transactions

4. AUTOMATIC UPDATES
   - When products are sold, stock reduces automatically
   - No manual work needed
   - Dashboard and reports update in real-time

5. DISPATCH CONFIRMATION
   - Shop can confirm when dispatches arrive
   - Add notes about condition
   - Everything is tracked and timestamped

This creates complete visibility in the supply chain - from 
the moment Admin dispatches products, through receipt at the 
shop, all the way to the customer sale."
```

---

## Troubleshooting During Demo

| Problem | Solution |
|---------|----------|
| Dashboard won't load | Check server logs, ensure API running |
| No products in inventory | Verify shop has inventory items in DB |
| Cannot add to cart | Check stock > 0 for that product |
| Bill doesn't appear | Ensure sale created successfully |
| Stock doesn't reduce | Check inventoryService in server logs |
| Dispatch confirmation missing | Ensure dispatches in DB with received status |

---

## Post-Demo Notes

```
If time permits:
- Show Admin perspective (optional)
- Discuss analytics (optional)  
- Talk about batch dispatches (optional)
- Mention mobile app plans (optional)

Key takeaway:
"The system provides complete end-to-end visibility
and automation for the entire supply chain."
```

---

## Quick Reference Cards

### Demo URLs
```
Login:        http://localhost:5173/login
Dashboard:    http://localhost:5173/shop/dashboard
Inventory:    http://localhost:5173/shop/inventory
POS:          http://localhost:5173/shop/pos
Dispatch:     http://localhost:5173/shop/dispatch
```

### Test Credentials
```
Shop Email: demo@shop.com
Password: [whatever is set in your DB]
```

### Key Metrics to Mention
```
Before Demo: Note initial inventory count
After Sale: Show exact reduction
Example: 156 → 150 (6 units sold)
```

### Key Colors
```
🟢 GREEN:  In stock, ready to sell
🟡 YELLOW: Low stock, reorder needed  
🔴 RED:    Out of stock, request from admin
```

---

**Demo Time: ~15-18 minutes**
**Status: ✅ READY**
**Last Updated: 28-Feb-2026**
