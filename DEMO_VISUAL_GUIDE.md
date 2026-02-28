# 👀 SHOP DASHBOARD - VISUAL DEMO GUIDE

## What the Shop Manager Sees

### 1️⃣ LOGIN PAGE
```
┌─────────────────────────────┐
│   KIRAN DAIRY SYSTEM        │
│   Dairy Supply Management   │
├─────────────────────────────┤
│                             │
│  Login as Shop Manager      │
│                             │
│  📧 Email: demo@shop.com    │
│  🔑 Password: ••••••      │
│                             │
│  [    Login    ]            │
│                             │
│  Not registered? Sign up    │
└─────────────────────────────┘
```

---

### 2️⃣ SHOP DASHBOARD (Main View)
```
┌─────────────────────────────────────────────────────────────┐
│  SHOP: Delhi Dairy Store | User: Manager (logout)          │
├─────────────────────────────────────────────────────────────┤
│                          Shop Dashboard                      │
├─────────────────────────────────────────────────────────────┤

╔═ STATS SECTION ═════════════════════════════════════════════╗
║                                                             ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ║
║  │ 📦 Inventory │  │ 💳 Sales     │  │ 💰 Revenue   │    ║
║  │              │  │              │  │              │    ║
║  │  5,432       │  │  15          │  │  ₹45,000     │    ║
║  │  Units       │  │  (today)     │  │  (today)     │    ║
║  └──────────────┘  └──────────────┘  └──────────────┘    ║
║                                                             ║
║  ┌──────────────┐  ┌──────────────┐                       ║
║  │ ↩️ Returns   │  │ 👥 Staff     │                       ║
║  │              │  │              │                       ║
║  │  2           │  │  8/10        │                       ║
║  │  Pending     │  │  Active      │                       ║
║  └──────────────┘  └──────────────┘                       ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝

╔═ MANAGEMENT CARDS ══════════════════════════════════════════╗
║                                                             ║
║  ┌──────────────────┐    ┌──────────────────┐             ║
║  │ 👥 Staff        │    │ 📋 Payments     │             ║
║  │ Management      │    │                  │             ║
║  │ 8/10 Active     │    │ ₹12,500         │             ║
║  │ [Manage Staff]  │    │ Pending         │             ║
║  │                │    │ [Pay Staff]     │             ║
║  └──────────────────┘    └──────────────────┘             ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝

╔═ QUICK ACTIONS ═════════════════════════════════════════════╗
║                                                             ║
║  [Start Sale]  [View Inventory]  [Confirm Dispatch] ...   ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝
```

---

### 3️⃣ RECEIVED STOCK SUMMARY (New Section!)
```
╔═ 📦 RECENTLY RECEIVED STOCK ════════════════════════════════╗
║                                                             ║
║ ┌─────────────────────────────────────────────────────┐   ║
║ │ Dispatch: DISP-2026-00145           [Received ✓]   │   ║
║ │ Received: 28-Feb-2026                              │   ║
║ │ Confirmed by: Admin Manager                        │   ║
║ │                                                     │   ║
║ │ Products Received:                                 │   ║
║ │ ┌────────────────┐ ┌────────────────┐             │   ║
║ │ │ Milk 1L        │ │ Paneer         │             │   ║
║ │ │ Qty: 100       │ │ Qty: 50        │             │   ║
║ │ │ ₹50/unit       │ │ ₹250/unit      │             │   ║
║ │ └────────────────┘ └────────────────┘             │   ║
║ │ ┌────────────────┐                                │   ║
║ │ │ Yogurt         │                                │   ║
║ │ │ Qty: 75        │                                │   ║
║ │ │ ₹30/unit       │                                │   ║
║ │ └────────────────┘                                │   ║
║ └─────────────────────────────────────────────────────┘   ║
║                                                             ║
║ ┌─────────────────────────────────────────────────────┐   ║
║ │ Dispatch: DISP-2026-00144           [Received ✓]   │   ║
║ │ Received: 27-Feb-2026                              │   ║
║ │ ... [more dispatches below]                        │   ║
║ └─────────────────────────────────────────────────────┘   ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝

KEY POINT: "The shop can see exactly what products and 
           quantities were received from Admin"
```

---

### 4️⃣ VIEW INVENTORY PAGE
```
┌──────────────────────────────────────────────────────────┐
│                  Inventory Management                    │
├──────────────────────────────────────────────────────────┤

╔═ SUMMARY CARDS ═════════════════════════════════════════╗
║                                                         ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ ║
║  │ Products     │  │ Total Units  │  │ Low Stock  │ ║
║  │  15          │  │  5,432       │  │  3         │ ║
║  └──────────────┘  └──────────────┘  └──────────────┘ ║
║                                                         ║
║  ┌──────────────┐                                       ║
║  │ Out of Stock │                                       ║
║  │  2           │                                       ║
║  └──────────────┘                                       ║
║                                                         ║
╚═════════════════════════════════════════════════════════╝

╔═ INVENTORY TABLE ═══════════════════════════════════════╗
║                                                         ║
║ Product          | SKU     | Qty  | Status    | Price  ║
║─────────────────────────────────────────────────────── ║
║ Milk 1L          | MIL001  | 156  │ 🟢 IN ST | ₹50   ║
║ Paneer           | PAN001  | 3    │ 🟡 LOW ST| ₹250  ║
║ Yogurt           | YOG001  | 0    │ 🔴 OUT   | ₹30   ║
║ Dahi             | DAH001  | 145  │ 🟢 IN ST | ₹45   ║
║ Butter           | BUT001  | 67   │ 🟢 IN ST | ₹180  ║
║ [More products...]                                      ║
║                                                         ║
╚═════════════════════════════════════════════════════════╝

COLOR LEGEND:
🟢 IN STOCK (5+ units)
🟡 LOW STOCK (< 5 units)  
🔴 OUT OF STOCK (0 units)

KEY POINT: "Real-time stock visibility at shop level"
```

---

### 5️⃣ POS BILLING SCREEN
```
┌─────────────────────────────────────────────────────────────┐
│                      POS Billing                            │
├─────────────────────────────────────────────────────────────┤

┌──────────────────────────┐  ┌────────────────────────────┐
│   AVAILABLE PRODUCTS     │  │        CART                │
├──────────────────────────┤  ├────────────────────────────┤
│                          │  │                            │
│ ┌──────────────────────┐ │  │ Milk 1L        ₹50      │
│ │ Milk 1L      (🟢)    │ │  │ ├─ Qty: [6]               │
│ │ Qty: 156     In     │ │  │ ├─ Stock: 150            │
│ │ ₹50/unit            │ │  │ └─ ₹300                  │
│ │                     │ │  │                            │
│ │ [Click to Add ➕]   │ │  │ Paneer        ₹1,000     │
│ └──────────────────────┘ │  │ ├─ Qty: [4]               │
│                          │  │ ├─ Stock: 0              │
│ ┌──────────────────────┐ │  │ └─ ₹4,000                │
│ │ Paneer       (🟡)    │ │  │                            │
│ │ Qty: 3       Low    │ │  │ ──────────────────────── │
│ │ ₹250/unit           │ │  │                            │
│ │                     │ │  │ TOTAL: ₹5,300             │
│ │ [Click to Add ➕]   │ │  │                            │
│ └──────────────────────┘ │  │ [Checkout]                │
│                          │  │                            │
│ ┌──────────────────────┐ │  │                            │
│ │ Yogurt       (🔴)    │ │  │                            │
│ │ Qty: 0       Out    │ │  │                            │
│ │ ₹30/unit            │ │  │                            │
│ │                     │ │  │                            │
│ │ [Out of Stock]      │ │  │                            │
│ └──────────────────────┘ │  │                            │
│                          │  │                            │
│ [More products...]       │  │                            │
└──────────────────────────┘  └────────────────────────────┘

KEY POINT: "When shop sells a product, the system 
           automatically reduces the quantity from stock"
```

---

### 6️⃣ CHECKOUT MODAL
```
┌──────────────────────────────────┐
│    Confirm Payment               │
├──────────────────────────────────┤
│                                  │
│  Total Amount                    │
│  ₹5,300                          │
│                                  │
│  Payment Method                  │
│  ┌──────────────────────────┐   │
│  │ ▼ Cash                   │   │
│  │ └─ Card                  │   │
│  │ └─ Online Transfer       │   │
│  │ └─ Cheque                │   │
│  └──────────────────────────┘   │
│                                  │
│  [Cancel]  [Complete Payment]   │
│                                  │
└──────────────────────────────────┘

ACTION: Select Cash → Click Complete Payment
```

---

### 7️⃣ BILL PREVIEW (After Sale)
```
╔═══════════════════════════════════════════════════╗
║                  INVOICE                          ║
║            Delhi Dairy Store                      ║
║                                                   ║
║  Bill No: BILL-2026-00532                        ║
║  Date: 28-Feb-2026 14:35                         ║
║  ───────────────────────────────────────────     ║
║                                                   ║
║  Item          | Qty | @Price | Total            ║
║  ───────────────────────────────────────────     ║
║  Milk 1L       | 6   | ₹50    | ₹300            ║
║  Paneer        | 4   | ₹250   | ₹1,000          ║
║  ───────────────────────────────────────────     ║
║                          Sub Total: ₹1,300       ║
║                          Tax (0%): ₹0             ║
║                          TOTAL: ₹1,300            ║
║  ───────────────────────────────────────────     ║
║  Payment Method: CASH                            ║
║  Status: PAID ✓                                  ║
║                                                   ║
║  Thank you for your purchase!                    ║
║  ───────────────────────────────────────────     ║
║
║                      [🖨️ Print Bill]
║
╚═══════════════════════════════════════════════════╝

KEY POINT: "Sales record is stored, inventory auto-updated"
```

---

### 8️⃣ INVENTORY AFTER SALE
```
Back to Inventory Page:

Before Sale:
Milk 1L | SKU: MIL001 | 156 | ₹50 | 🟢 IN STOCK

After Sale (6 units):
Milk 1L | SKU: MIL001 | 150 | ₹50 | 🟢 IN STOCK
                       ↑
                   Reduced by 6

Before Sale:
Paneer | SKU: PAN001 | 3 | ₹250 | 🟡 LOW STOCK

After Sale (4 units, but only 3 available):
[Not possible - stock insufficient]
[Proper stock validation prevents overselling]

KEY POINT: "System automatically reduces stock
           Dashboard and reports update accordingly"
```

---

### 9️⃣ DISPATCH CONFIRMATION PAGE
```
┌──────────────────────────────────────────────────────┐
│          Dispatch Confirmation                       │
├──────────────────────────────────────────────────────┤

╔═ SUMMARY ═════════════════════════════════════════╗
║  Total Dispatches: 5                              ║
║  Pending: 2   Confirmed: 3                        ║
╚═══════════════════════════════════════════════════╝

Filter: [All] [Pending] [Confirmed]

┌──────────────────────────────────────────────────┐
│ Dispatch: DISP-2026-00146 [Pending ⏳]           │
│ Date: 27-Feb-2026                                │
│ Items: Milk (50), Paneer (20)                    │
│ Status: Dispatched on 27-Feb, awaiting receipt   │
│                                                   │
│                    [Confirm Receipt]              │
└──────────────────────────────────────────────────┘

[Modal appears on Confirm Receipt]
┌─────────────────────────────────────────────┐
│  Add Notes (Optional)                       │
│  ┌──────────────────────────────────────┐  │
│  │ Goods received in good condition     │  │
│  │ No damage detected                   │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  [Cancel]  [Confirm Receipt]               │
└─────────────────────────────────────────────┘

Success: "Dispatch confirmed as received!"
Status changes to: [Confirmed ✓]
```

---

## 📊 Demo Timing

| Step | Activity | Time |
|------|----------|------|
| 1 | Login | 1 min |
| 2 | Dashboard Overview | 2 min |
| 3 | View Received Stock Summary | 1 min |
| 4 | Navigate to Inventory | 1 min |
| 5 | Show Inventory Details | 2 min |
| 6 | POS - Add Products | 2 min |
| 7 | Complete Checkout | 2 min |
| 8 | View Bill | 1 min |
| 9 | Verify Stock Reduced | 1 min |
| 10 | Dispatch Confirmation | 2 min |
| **TOTAL** | | **15 min** |

---

## 🎤 Key Phrases During Demo

1. "**The shop can see exactly what products and quantities were received from Admin.**"

2. **"Real-time stock visibility at shop level"** - shown on Inventory page

3. **"When shop sells a product, the system automatically reduces the quantity from stock"** - after POS transaction

4. **"Sales record is stored and dashboard/reports update accordingly"** - after showing bill

5. **"Complete supply chain visibility from dispatch to sale confirmation**" - concluding point

