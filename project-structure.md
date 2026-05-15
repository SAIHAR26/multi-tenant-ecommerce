# V SHOP

# Multi-Tenant Ecommerce SaaS Platform

---

# 1. PROJECT OVERVIEW

V SHOP is a Multi-Tenant Ecommerce SaaS Platform where multiple vendors can create their own stores and sell products while customers can buy products from different vendors inside one platform.

The platform contains three major roles:

- Admin
- Vendor
- Customer

The project focuses on:

- Secure authentication
- Product management
- Order management
- Analytics dashboard
- Vendor management
- Customer shopping experience
- Modern UI/UX
- Role-based access control

---

# 2. UI STYLE AND DESIGN SYSTEM

## Theme

- Dark Black Theme
- White Text
- Red Accent Colors

## Design Style

- Modern SaaS Dashboard Style
- Professional Ecommerce UI
- Rounded Cards
- Sidebar + Top Navbar Layout
- Responsive Design
- Smooth Hover Effects
- Minimal and Clean Interface

## Color Palette

| Purpose | Color |
|---|---|
| Background | Black / Dark Gray |
| Cards | Dark Gray |
| Text | White |
| Buttons | Red |
| Hover Effects | Dark Red |
| Success | Green |
| Error | Red |

---

# 3. USER ROLES

## ADMIN

Admin controls the entire platform.

### Admin Responsibilities

- Manage all users
- Manage all vendors
- Approve or reject vendors
- Monitor products
- View analytics
- Manage reports
- Moderate reviews
- Handle customer service
- Handle vendor service
- Send announcements
- Monitor revenue
- Fraud detection

---

## VENDOR

Vendor manages their own store and products.

### Vendor Responsibilities

- Add products
- Edit products
- Delete products
- Manage orders
- View analytics
- Reply to reviews
- Manage stock
- Track monthly income
- Contact admin support
- Customize store

---

## CUSTOMER

Customer buys products from vendors.

### Customer Responsibilities

- Browse products
- Search products
- Add to cart
- Add to wishlist
- Place orders
- Track orders
- Write reviews
- Manage profile
- Manage addresses
- View order history

---

# 4. LANDING PAGE STRUCTURE

## Navbar

- Home
- Collections
- Reviews
- Connect
- About
- Trending
- Signup/Login

---

## Hero Section

Contains:

- Main banner
- Featured products
- Shop Now button
- Become Vendor button

---

## Homepage Sections

- Featured Products
- Top Vendors
- Trending Categories
- Customer Reviews
- Festival Offers
- Recommended Products

---

# 5. AUTHENTICATION SYSTEM

Authentication is role-based.

Only:

- Vendor
- Customer

can signup publicly.

Admin accounts are manually created.

---

## Authentication Features

- Email OTP Verification
- Password Hashing using bcryptjs
- JWT Authentication
- Protected Routes
- Role-based Access

---

# 6. VENDOR SIGNUP FLOW

## STEP 1 — BASIC DETAILS

- Full Name
- Email
- Phone Number
- Email OTP Verification
- Password
- Confirm Password

---

## STEP 2 — STORE DETAILS

- Store Name
- Store Description
- Store Category
- Store Logo
- Store Banner

---

## STORE CATEGORIES

- Books
- Shoes
- Men Wear
- Women Wear
- Kids
- Electronics
- Accessories
- Others

---

## STEP 3 — LOCATION DETAILS

- Country
- State
- City
- Address
- Pincode

---

## STEP 4 — BANK DETAILS

- Bank Name
- Account Holder Name
- Account Number
- IFSC Code
- UPI ID

---

## STEP 5 — FINAL SETTINGS

- Terms & Conditions
- Privacy Policy Checkbox

---

## VENDOR STATUS

- Pending
- Approved
- Rejected

Admin manually approves vendors.

---

# 7. CUSTOMER SIGNUP FLOW

## Customer Details

- Full Name
- Email
- Phone Number
- Email OTP Verification
- Location
- Age
- Gender
- Profile Picture
- Favorite Categories
- Password
- Confirm Password

---

## CUSTOMER FEATURES

- Change Password
- Change Phone Number
- Manage Profile
- Saved Addresses
- Wishlist

---

# 8. LOGIN SYSTEM

## Roles

- Admin
- Vendor
- Customer

---

## Login Fields

- Email
- Password

---

## LOGIN FLOW

User selects role
↓
User enters credentials
↓
Backend validates user
↓
JWT token generated
↓
Frontend stores token
↓
Dashboard access granted

---

# 9. ADMIN DASHBOARD

## Dashboard Overview

- Total Users
- Total Vendors
- Total Orders
- Total Revenue
- Pending Vendor Requests

---

## ADMIN FEATURES

- Manage Customers
- Manage Vendors
- Approve Vendors
- Reject Vendors
- Manage Products
- Monitor Reviews
- View Reports
- Revenue Analytics
- Fraud Detection
- Inventory Monitoring
- Customer Service Management
- Vendor Service Management
- Coupon Management

---

## ANALYTICS FEATURES

- Top-selling Products
- Least-selling Products
- Monthly Revenue Graphs
- Vendor Performance Graphs
- User Growth Graphs

---

## ANNOUNCEMENT SYSTEM

Admin can:

- Send Emails
- Send Notifications
- Send Announcements

to vendors and customers.

---

# 10. VENDOR DASHBOARD

## Dashboard Overview

- Revenue
- Orders
- Products
- Monthly Sales
- Store Statistics

---

## PRODUCT MANAGEMENT

Vendor can:

- Add Products
- Edit Products
- Delete Products
- Manage Stock

---

## PRODUCT FORM

- Minimum 3 Images
- Product Name
- Product Description
- Price
- Discount
- Category
- Available Sizes
- Available Colors
- Material
- Brand
- Shipping Details
- Delivery Estimate
- Return Policy
- Contact Details

---

## VENDOR FEATURES

- Store Customization
- Store Banner Upload
- Analytics Dashboard
- Review Replies
- Order Management
- Monthly Income Tracking
- Top-selling Products
- Least-selling Products

---

## VENDOR SUPPORT

Vendor can:

- Contact Admin
- Report Problems
- Request Support

---

# 11. CUSTOMER DASHBOARD

## CUSTOMER FEATURES

- Browse Products
- Search Products
- Filter Products
- Wishlist
- Shopping Cart
- Order History
- Order Tracking
- Recommendations
- Saved Addresses
- Payment Methods

---

## SEARCH SYSTEM

Includes:

- Product Search
- Category Filters
- Price Filters
- Rating Filters
- Sorting Options

---

## PRODUCT PAGE FEATURES

- Product Images
- Product Description
- Vendor Details
- Ratings
- Reviews
- Quantity Selector
- Stock Availability
- Suggested Products
- Recently Viewed Products

---

# 12. REVIEW SYSTEM

## REVIEW FEATURES

- Star Ratings
- Written Reviews
- Image Upload Required

---

## REVIEW FLOW

Customer buys product
↓
Customer writes review
↓
Vendor replies
↓
Admin moderates if necessary

---

## RATINGS BREAKDOWN

Example:

- 5 Star → 80%
- 4 Star → 15%
- 3 Star → 5%

---

# 13. CART SYSTEM

## CART FEATURES

- Add to Cart
- Remove from Cart
- Increase Quantity
- Decrease Quantity
- Save for Later

---

# 14. PAYMENT SYSTEM

## CHECKOUT PAGE

Contains:

- Product Summary
- Delivery Charges
- Total Price
- Delivery Address
- Payment Method

---

## PAYMENT OPTIONS

- Cash on Delivery
- Online Payment

---

## ONLINE PAYMENT

Current Plan:

- QR Code Payment

Future Plan:

- Razorpay Integration
- Stripe Integration

---

## PAYMENT FEATURES

- Saved Payment Methods
- Invoice Download
- Refund Tracking

---

# 15. ORDER TRACKING SYSTEM

## ORDER STAGES

- Processing
- Packed
- Shipped
- Out for Delivery
- Delivered

---

## TRACKING FEATURES

- Live Order Status
- Delivery Estimate
- Notifications

---

# 16. NOTIFICATION SYSTEM

## NOTIFICATIONS

- Order Updates
- Offer Notifications
- Vendor Announcements
- Admin Notifications

---

# 17. CUSTOMER SERVICE SYSTEM

## CUSTOMER SERVICE

Customers can:

- Report Problems
- Contact Support
- Raise Complaints

---

## VENDOR SERVICE

Vendors can:

- Contact Admin
- Report Technical Issues
- Request Help

---

# 18. PROJECT ARCHITECTURE

## TECHNOLOGY STACK

### Frontend

- React
- Vite

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Authentication

- JWT
- bcryptjs

---

# 19. SYSTEM FLOW

User interacts with frontend
↓
Frontend sends API request
↓
Backend processes request
↓
MongoDB stores/fetches data
↓
Backend sends response
↓
Frontend updates UI

---

# 20. FRONTEND STRUCTURE

```plaintext
frontend/src
│
├── components
├── pages
├── layouts
├── routes
├── services
├── context
├── assets
├── hooks
├── utils
FOLDER EXPLANATIONS
components

Reusable UI components.

Examples:

Navbar
Sidebar
ProductCard
Footer
ReviewCard
pages

Actual application pages.

Examples:

Home
Login
Register
Dashboard
Cart
layouts

Page structures.

Examples:

DashboardLayout
MainLayout
routes

React Router setup.

services

API request functions.

Examples:

authService.js
productService.js
context

Global state management.

Examples:

AuthContext
CartContext
assets

Images, icons and static files.

hooks

Custom React hooks.

utils

Helper functions.

21. BACKEND STRUCTURE
backend
│
├── controllers
├── routes
├── models
├── middlewares
├── config
BACKEND FOLDER EXPLANATION
controllers

Contains backend business logic.

routes

Contains API routes.

models

Contains MongoDB schemas.

middlewares

Contains authentication middleware.

config

Contains database configuration.

22. PRODUCT FLOW

Vendor adds product
↓
Backend stores product
↓
Product appears on customer side
↓
Customer orders product
↓
Vendor receives order
↓
Order tracking starts

23. PAYMENT FLOW

Customer clicks checkout
↓
Chooses payment method
↓
Payment completed
↓
Order created
↓
Vendor notified
24. TEAM WORKFLOW
BEFORE STARTING WORK
git pull
AFTER COMPLETING WORK
git add .
git commit -m "message"
git push
25. BRANCH STRUCTURE
main
frontend-feature
backend-feature
auth-feature
database-feature
26. REUSABLE COMPONENTS
COMMON COMPONENTS
Navbar
Sidebar
Footer
ProductCard
ReviewCard
AnalyticsCard
Buttons
Inputs
Modals
27. FUTURE FEATURES

Possible future improvements:

AI Recommendations
Live Chat System
Push Notifications
Mobile Application
Advanced Analytics
Vendor Subscription Plans
28. FINAL CONCLUSION

V SHOP is designed as a modern scalable Multi-Tenant Ecommerce SaaS Platform using the MERN stack.

The project focuses on:

Professional UI Design
Secure Authentication
Role-based Dashboards
Vendor Management
Customer Shopping Experience
Analytics Systems
Modern Architecture

This structure provides strong foundation for scalable full-stack development.