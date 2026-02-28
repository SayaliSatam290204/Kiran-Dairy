# ✅ PRE-DEMO VERIFICATION CHECKLIST

Use this checklist 5-10 minutes before starting the demo to ensure everything works.

---

## 🔧 SYSTEM SETUP (5 minutes)

- [ ] Backend server is running on correct port
  ```
  Check: Terminal shows "Server running on port [X]"
  If not: cd server && npm start
  ```

- [ ] Frontend is running and accessible
  ```
  Check: http://localhost:5173 shows Login page
  If not: cd client && npm run dev
  ```

- [ ] MongoDB connection is active
  ```
  Check: No "MongoDB connection error" in server logs
  If not: Verify mongod is running
  ```

---

## 🗄️ DATABASE VERIFICATION (3 minutes)

- [ ] Test shop exists
  ```
  mongosh → use kiran_dairy → db.shops.findOne()
  Should return a shop document
  ```

- [ ] Shop has email credentials
  ```
  mongosh → db.users.findOne({role: "shop"})
  Should show email like "demo@shop.com"
  ```

- [ ] Products exist in database
  ```
  mongosh → db.products.count()
  Should be > 5 products
  ```

- [ ] Shop has inventory items
  ```
  mongosh → db.inventories.findOne({shopId: ObjectId("...")})
  Should show products with quantities
  ```

- [ ] Received dispatches exist
  ```
  mongosh → db.dispatches.findOne({status: "received"})
  Should show at least 1 received dispatch
  ```

- [ ] Sales data exists
  ```
  mongosh → db.sales.findOne({})
  Should show at least 1 sale record (for revenue calculation)
  ```

---

## 🔐 LOGIN VERIFICATION (2 minutes)

- [ ] Can navigate to login page
  ```
  URL: http://localhost:5173/login
  Should show: Email & Password inputs
  ```

- [ ] Can login with shop credentials
  ```
  Use: demo@shop.com and correct password
  Expected: Redirected to /shop/dashboard
  No errors in console
  ```

- [ ] Dashboard loads without errors
  ```
  Expected: See stats cards
  Check: Browser console shows no red errors
  Timeline: Should load in < 3 seconds
  ```

---

## 📊 DASHBOARD VERIFICATION (3 minutes)

- [ ] Stats cards are displaying
  - [ ] Total Inventory (shows a number > 0)
  - [ ] Daily Sales (shows a number or 0)
  - [ ] Total Revenue (shows ₹ amount)
  - [ ] Pending Returns (shows 0 or more)
  - [ ] Active Staff (shows a number)

  ```
  If any card shows "NaN" or "--":
  Server log issue - check shopController.getDashboard()
  ```

- [ ] Recently Received Stock section exists
  ```
  Scroll down and confirm you see:
  - "Recently Received Stock" heading
  - At least 1 dispatch card with:
    - Dispatch number
    - Received date
    - Product list with quantities
  
  If missing:
  Check: shopApi.getReceivedDispatches() call in network tab
  ```

- [ ] Quick Action buttons are visible
  ```
  Should see 4 buttons:
  ✓ Start Sale
  ✓ View Inventory  
  ✓ 📦 Confirm Dispatch
  ✓ Manage Returns
  ```

---

## 📦 INVENTORY VERIFICATION (2 minutes)

- [ ] Click "View Inventory" button
  ```
  Expected: Navigate to /shop/inventory
  Expected: Page loads in < 2 seconds
  ```

- [ ] Summary cards show correct data
  ```
  Should see:
  ✓ Total Products count
  ✓ Total Units count
  ✓ Low Stock count (items < 5)
  ✓ Out of Stock count (items = 0)
  
  Ballpark check:
  - Total Products should match product count
  - Total Units should be > 100
  - Low Stock and Out of Stock should be a small % of total
  ```

- [ ] Product table displays correctly
  ```
  Columns should be (left to right):
  1. Product (with SKU)
  2. Quantity
  3. Unit Price
  4. Status (with colored badge)
  5. Category
  6. Last Updated
  
  Data check:
  - At least 5 products visible
  - Status badges show 🟢/🟡/🔴 colors
  - Quantities are numbers (not empty)
  ```

- [ ] Color coding is correct
  ```
  Check products and verify:
  - 🟢 GREEN for items with qty ≥ 5
  - 🟡 YELLOW for items with qty < 5 (but > 0)
  - 🔴 RED for items with qty = 0
  
  If wrong: Check getStockColor() function in Inventory.jsx
  ```

---

## 🛒 POS VERIFICATION (3 minutes)

- [ ] Navigate to POS
  ```
  Click "Start Sale" button from Dashboard
  Expected: Redirect to /shop/pos
  Expected: Load in < 2 seconds
  ```

- [ ] Products are listed
  ```
  Left side should show:
  ✓ Product cards with name, price, available qty
  ✓ Click-able for adding to cart
  ✓ At least 5 products visible
  ```

- [ ] Can add product to cart
  ```
  ACTION: Click any product
  EXPECTED: 
  - Toast: "Added to cart" (or similar)
  - Product appears in right-side cart
  ```

- [ ] Can modify quantity
  ```
  ACTION: In cart, increase qty from 1 to 3
  EXPECTED:
  - Quantity updates
  - Subtotal recalculates
  - Stock count still shows remaining
  ```

- [ ] Can proceed to checkout
  ```
  ACTION: Click "Checkout" button
  EXPECTED:
  - Modal appears: "Confirm Payment" 
  - Shows: Total Amount
  - Shows: Payment method dropdown
  - Shows: "Complete Payment" button
  ```

- [ ] Sale completes successfully
  ```
  ACTION: With Cash selected, click "Complete Payment"
  EXPECTED:
  - Toast: "Sale completed!" or "Payment successful!"
  - Bill preview modal appears
  - Cart clears and resets
  - No console errors
  ```

- [ ] Bill preview shows correct data
  ```
  In bill modal, verify:
  ✓ Items list matches what was sold
  ✓ Quantities are correct
  ✓ Unit prices correct
  ✓ Total is calculated correctly
  ✓ Payment method shows "CASH"
  ✓ Status shows "PAID"
  ```

---

## 🔄 STOCK REDUCTION VERIFICATION (2 minutes)

- [ ] Navigate back to Inventory
  ```
  ACTION: Click "View Inventory" from sidebar
  OR: Direct URL /shop/inventory
  ```

- [ ] Stock has been reduced
  ```
  For products you sold in POS:
  
  EXAMPLE: Sold 3 units of "Milk 1L"
  ✓ Quantity should have reduced by 3
  ✓ Status may have changed (e.g., green to yellow)
  ✓ Last Updated date is current
  
  VERIFICATION MATH:
  Before: 156 units
  After:  153 units (if you sold 3)
  Reduction: 156 - 153 = 3 ✓ CORRECT
  ```

---

## 📤 DISPATCH VERIFICATION (Optional - 2 minutes)

- [ ] Dispatch page accessible
  ```
  ACTION: Click "📦 Confirm Dispatch" from Dashboard
  EXPECTED: Navigate to /shop/dispatch page
  EXPECTED: See list of dispatches
  ```

- [ ] Dispatches are showing
  ```
  Should see:
  ✓ Pending/Dispatched status dispatches
  ✓ Dispatch numbers
  ✓ Items lists
  ✓ "Confirm Receipt" buttons
  ```

- [ ] Can confirm dispatch (optional)
  ```
  If testing:
  ACTION: Click "Confirm Receipt" for any dispatch
  EXPECTED: Modal appears for notes
  ACTION: Add note or leave blank
  ACTION: Click "Confirm"
  EXPECTED: Toast and dispatch status updates
  ```

---

## 🔍 BROWSER CONSOLE CHECK (1 minute)

- [ ] Open Browser DevTools (F12)
- [ ] Click "Console" tab
- [ ] Check for errors
  ```
  ✓ Should be CLEAN - no red error messages
  ✓ Some yellow warnings are OK
  ✓ Blue info messages are OK
  
  If red errors:
  Take note and fix before demo
  ```

- [ ] Check Network tab
  ```
  For last action (like inventory load):
  ✓ All API calls should show "200" or "201" status
  ✓ No "404" or "500" errors
  ✓ Response times under 500ms each
  ```

---

## ⏱️ PERFORMANCE CHECK (1 minute)

- [ ] Dashboard loads in < 3 seconds
- [ ] Inventory page loads in < 2 seconds
- [ ] POS page loads in < 2 seconds
- [ ] Adding products to cart is instant
- [ ] Checkout modal appears immediately

```
If any is slow:
Check: Browser network tab for bottleneck
Check: Server console for slow database queries
```

---

## 🎯 DEMO-SPECIFIC CHECKS

### If showing Total Revenue stat:
- [ ] Revenue is calculating correctly
  ```
  Check: Dashboard shows non-zero revenue (if sales exist)
  Formula: Sum of all sales today
  Expected: ₹[amount] > 0 if there are sales
  ```

### If showing Received Stock:
- [ ] At least 1 received dispatch is visible
  ```
  Check: "Recently Received Stock" shows dispatches
  Each dispatch shows:
  - Dispatch number
  - Received date  
  - Products with quantities
  ```

### If user might question data:
- [ ] All dates are formatted consistently
  ```
  Expected format: DD-MMM-YYYY (28-Feb-2026)
  All pages should match
  ```

- [ ] All currency shows ₹ symbol
  ```
  Expected: ₹50, ₹250, ₹10,000 (with commas if > 999)
  ```

---

## 🚨 CRITICAL ISSUES TO FIX (Before proceeding)

| Issue | Fix |
|-------|-----|
| Login fails | Verify user email and password in DB |
| Dashboard doesn't load | Check server logs for errors, restart server |
| Stats show "NaN" or "--" | Check getDashboard() controller for bugs |
| No received stock showing | Verify dispatches exist with status "received" |
| Inventory table empty | Verify shop has inventory items |
| Stock doesn't reduce after sale | Check inventoryService for errors |
| Bills don't show | Check sales creation in POS controller |
| Dispatch confirmation button missing | Hard refresh browser (Ctrl+F5) |

---

## ✅ FINAL SIGN-OFF

Before starting demo, confirm:

- [ ] All critical checks passed above
- [ ] No red errors in browser console
- [ ] All API calls returning 200-201 status
- [ ] Demo flow takes ~15-18 minutes
- [ ] You're familiar with all demo steps
- [ ] You have test credentials ready
- [ ] Network is stable
- [ ] Screenshare/projection is working (if remote)

```
✅ SYSTEM IS DEMO-READY

Estimated Demo Duration: 15-18 minutes
Recommended Buffer: 5 minutes
Total Time Needed: 20-23 minutes
```

---

**Created:** 28-Feb-2026  
**Status:** ✅ READY  
**Last Verified:** [Your date/time]
