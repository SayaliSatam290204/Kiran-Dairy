# 🔐 Shop Creation with User Account & Password

## Overview
When an admin creates a new shop, the system now automatically creates a corresponding user account with login credentials.

---

## What Gets Created

### 1. **Shop Record**
Store location, inventory, dispatch information
```
{
  name: "Shop Name",
  location: "Address",
  ownerName: "Owner Full Name",
  contactNo: "Phone Number (used as username)",
  email: "shop@email.com",
  address: "Full Address",
  isActive: true
}
```

### 2. **User Account (Auto-Created)**
Login credentials for shop access
```
{
  name: "Owner Full Name",
  email: "shop@email.com",
  username: "Phone Number" (stored in contactNo)
  password: "Hashed Password",
  role: "shop",
  shopId: [Reference to Shop],
  isActive: true
}
```

---

## Admin Creation Flow

### Step 1: Open Shop Management
- Admin → Shop Management → "+ Add Shop" button

### Step 2: Fill Shop Form
```
┌─────────────────────────────────────┐
│   SHOP INFORMATION                  │
├─────────────────────────────────────┤
│ Shop Name: Kiran Dairy - Branch A  │
│ Location: Mumbai                    │
│                                     │
│   OWNER INFORMATION                 │
├─────────────────────────────────────┤
│ Owner Name: Rajesh Kumar           │
│ Email: rajesh@kiran.com            │
│ Contact Number: 9876543210         │
│ Password: MySecur3Pass!            │
│                                     │
│   ADDRESS                           │
├─────────────────────────────────────┤
│ Full Address: 123 Dairy Street... │
│                                     │
│ ✓ Create Shop | ✕ Cancel          │
└─────────────────────────────────────┘
```

### Step 3: Success Message
```
✅ "Shop and user account created successfully"
```

**Behind the scenes:**
- ✅ **Shop created** in `shops` collection
- ✅ **User created** in `users` collection with:
  - email = shop email
  - password = hashed version of provided password
  - role = "shop"
  - shopId = reference to the shop

---

## Shop Login

### Credentials for Shop Owner
```
Email: rajesh@kiran.com
Password: MySecur3Pass!
```

OR (Alternative - using phone as username)
```
Username (Phone): 9876543210
Password: MySecur3Pass!
```

### Login Flow
1. Shop owner goes to login page
2. Enters **Email** (or can use phone number if system updated)
3. Enters **Password** (the one set during creation)
4. System validates and redirects to shop dashboard

---

## Important Notes

### ✅ Do's
- **Always set a strong password** - minimum 8 characters
- **Communicate credentials securely** - send in separate messages
- **Update password periodically** - if needed early feature
- **Verify email is correct** - Shop owner must use this to login

### ❌ Don'ts
- Don't reuse the same password for multiple shops
- Don't set password as "password" or "12345678"
- Don't forget the password - it's hashed and can't be retrieved
- Don't share credentials in unencrypted channels

### 📝 Password Reset Option
If shop owner forgets password:
1. Admin must contact development team to reset
2. Or admin can delete and recreate shop (last resort)
3. Future enhancement: Add "Reset Password" feature in admin panel

---

## API Details

### Create Shop Endpoint
```
POST /admin/shops
```

**Request Headers:**
```javascript
Authorization: Bearer [admin_token]
Content-Type: application/json
```

**Request Body:**
```javascript
{
  "name": "Kiran Dairy - Branch A",
  "location": "Mumbai",
  "ownerName": "Rajesh Kumar",
  "contactNo": "9876543210",
  "email": "rajesh@kiran.com",
  "address": "123 Dairy Street, Mumbai, MH 400001",
  "password": "MySecur3Pass!"
}
```

**Success Response (201):**
```javascript
{
  "success": true,
  "data": {
    "shop": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Kiran Dairy - Branch A",
      "email": "rajesh@kiran.com",
      "contactNo": "9876543210",
      // ... other shop fields
    },
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Rajesh Kumar",
      "email": "rajesh@kiran.com",
      "role": "shop",
      "username": "9876543210"
    }
  },
  "message": "Shop and user account created successfully"
}
```

**Error Response (400):**
```javascript
{
  "success": false,
  "message": "All fields including password are required"
}
```

---

## System Response

### Email Already Exists (Shop)
```
❌ "Shop with this email already exists"
```
→ Choose different email

### User Already Exists
```
❌ "User account with this email already exists"
```
→ Use fresh email for new shop

### Missing Password
```
❌ "All fields including password are required"
```
→ Set a password for new shops

---

## Security Measures

✅ **Password Hashing**
- All passwords hashed with bcryptjs (salt: 10)
- Original password never stored in database

✅ **Validation**
- Email uniqueness checked in both shops and users
- Contact number used as username backing
- Phone number not used for login by default

✅ **User Account Linking**
- User.shopId links to the created shop
- User role set to "shop" (not admin)
- Auto-activation (isActive: true)

---

## Database Schema

### User Document for Shop
```javascript
{
  _id: ObjectId,
  name: "Rajesh Kumar",
  email: "rajesh@kiran.com",
  password: "$2a$10$...[bcrypt_hash]...",
  role: "shop",
  shopId: ObjectId("507f1f77bcf86cd799439011"),
  isActive: true,
  createdAt: Date,
  updatedAt: Date
}
```

### Shop Document
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Kiran Dairy - Branch A",
  location: "Mumbai",
  ownerName: "Rajesh Kumar",
  contactNo: "9876543210",
  email: "rajesh@kiran.com",
  address: "123 Dairy Street...",
  isActive: true,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Editing Mode

### Edit Existing Shop
- Admin can edit shop details (name, location, address, etc.)
- **Password field is hidden** during edit (can't change password via shop edit)
- **No password validation** in edit mode
- Only shop details are updated, not user account

---

## Testing the Feature

### Test Case 1: Create Shop with Valid Data
```
Input:
  Name: Test Shop
  Owner: John Doe
  Email: john@test.com
  Contact: 9999999999
  Address: 123 Main St
  Password: Test@1234

Expected:
  ✅ Toast: "Shop and user account created successfully"
  ✅ Shop appears in shop list
  ✅ Can login with email + password
```

### Test Case 2: Create Shop with Duplicate Email
```
Input:
  Same email as existing shop
  
Expected:
  ❌ Toast: "Shop with this email already exists"
  ✅ Modal stays open for correction
```

### Test Case 3: Create Shop without Password
```
Input:
  All fields filled except password (empty string)
  
Expected:
  ❌ Toast: "Password is required for new shops"
  ✅ Modal stays open
```

### Test Case 4: Shop Owner Login
```
Input:
  Email: john@test.com
  Password: Test@1234
  
Expected:
  ✅ Authentication succeeds
  ✅ Redirects to /shop/dashboard
  ✅ Can access all shop features
```

---

## Future Enhancements

1. **Password Reset Flow**
   - Email-based password reset
   - Temporary reset links
   - Security questions backup

2. **Username-Based Login**
   - Add optional username field
   - Allow login with phone number
   - Simpler for shop staff

3. **Multi-User per Shop**
   - Additional staff accounts
   - Different permission levels
   - Last login tracking

4. **Security Features**
   - Login attempt tracking
   - Account lockout after failed attempts
   - Session management
   - Login history

---

**Version:** 1.0  
**Date:** 28-Feb-2026  
**Status:** ✅ IMPLEMENTED & READY
