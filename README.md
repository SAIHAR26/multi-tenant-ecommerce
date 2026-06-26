# 🛒 V SHOP - Multi-Tenant Ecommerce Platform

## Overview

V SHOP is a full-stack Multi-Tenant Ecommerce Platform built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The platform enables Admins, Vendors, and Customers to operate within a single system while maintaining role-based access control and dedicated functionalities.

The project is designed to simulate a real-world ecommerce ecosystem where vendors manage stores and products, customers browse and purchase products, and administrators oversee platform operations.

---

# 🚀 Features

## Admin Features

* Secure Admin Authentication
* Dashboard Overview
* Vendor Management
* Vendor Approval & Rejection System
* Customer Management
* Product Management
* Order Monitoring
* Customer Segmentation
* Analytics Dashboard
* Reports Generation
* Notifications Management
* Reviews Monitoring
* Admin Settings Management
* Order Export Functionality
* Profile Management

---

## Vendor Features

* Vendor Registration
* Business Details Management
* Store Creation & Management
* Product Management

  * Add Product
  * Edit Product
  * Delete Product
* Order Management
* Revenue Tracking
* Analytics Dashboard
* Reviews Management
* Customer Review Replies
* Notification System
* Vendor Profile Management

---

## Customer Features

* Customer Registration & Login
* Product Browsing
* Product Search & Filtering
* Product Details Page
* Shopping Cart
* Wishlist
* Checkout System
* Order Placement
* Order Tracking
* Product Reviews & Ratings
* Personalized Recommendations
* Notifications
* Profile Management

---

# 🏗️ System Architecture

Frontend (React + Vite)
↓
Backend APIs (Express.js)
↓
MongoDB Database

The project follows a modular MERN architecture with clear separation between presentation, business logic, and data layers.

---

# 💻 Technology Stack

### Frontend

* React.js
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* bcrypt Password Hashing

### Version Control

* Git
* GitHub

---

# 👥 User Roles

## Admin

Responsible for monitoring and controlling the entire platform.

## Vendor

Responsible for store operations, product management, and order fulfillment.

## Customer

Responsible for browsing products, placing orders, and interacting with vendors.

---

# 📂 Major Modules

### Authentication Module

* Login
* Registration
* JWT Authentication
* Role-Based Access Control
* Password Hashing
* Protected Routes

### Product Module

* Product CRUD Operations
* Product Details
* Product Variants
* Inventory Tracking

### Store Module

* Store Profiles
* Business Information
* Store Analytics

### Order Module

* Order Placement
* Order Tracking
* Status Updates
* Order Export

### Cart Module

* Add to Cart
* Update Quantity
* Remove Products

### Wishlist Module

* Save Products
* Remove Products
* Move to Cart

### Review Module

* Ratings
* Reviews
* Vendor Replies

### Notification Module

* User Notifications
* Role-Based Notifications
* Read/Unread Management

### Analytics Module

* Revenue Analytics
* Order Analytics
* Vendor Analytics
* Customer Analytics

### Reports Module

* Revenue Reports
* Customer Reports
* Product Reports
* Order Reports

### Customer Segmentation Module

* Segment Creation
* Dynamic Customer Grouping
* Customer Analysis

---

# 🗄️ Database Collections

### User

Stores:

* Account Information
* Roles
* Authentication Data
* Vendor Business Details

### Store

Stores:

* Vendor Store Information
* Business Information

### Product

Stores:

* Product Information
* Inventory Data
* Pricing Details

### Order

Stores:

* Order Details
* Payment Information
* Tracking Status

### Cart

Stores:

* Customer Cart Items

### Wishlist

Stores:

* Saved Products

### Review

Stores:

* Ratings
* Customer Feedback

### Notification

Stores:

* User Notifications

### Segment

Stores:

* Customer Segmentation Rules

### Payment

Stores:

* Payment Records

### AdminSettings

Stores:

* Global Platform Settings

---

# 🔐 Security Features

* JWT Authentication
* bcrypt Password Hashing
* Role-Based Authorization
* Protected Routes
* Vendor Approval Workflow
* Session Validation

---

# 📊 Current Project Status

### Completed

✅ Authentication System

✅ Admin Dashboard

✅ Vendor Dashboard

✅ Customer Dashboard

✅ Product Management

✅ Order Management

✅ Cart System

✅ Wishlist System

✅ Review System

✅ Notification System

✅ Analytics

✅ Reports

✅ Customer Segmentation

✅ Vendor Approval Workflow

✅ Profile Management

---

### Future Enhancements

* Payment Gateway Integration
* Email Notification Service
* Automated Testing
* Advanced Inventory Management
* Logistics & Shipment Integration
* Two-Factor Authentication
* Cloud File Storage
* Production Deployment

---

# ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd multi-tenant-ecommerce
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### MongoDB Configuration

Create a `.env` file inside the backend folder and configure:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

# 📈 Project Progress

Week 1:

* Architecture Design
* Database Planning
* Authentication Foundation
* Dashboard Planning

Week 2:

* Core Frontend Development
* Backend API Development
* Database Integration

Week 3:

* Ecommerce Business Features
* Product & Order Modules
* Vendor Workflows

Week 4:

* Analytics
* Reports
* Customer Segmentation
* Full System Integration
* Optimization & Bug Fixes

---

# 🎯 Project Goal

To build a scalable, role-based, multi-tenant ecommerce platform that demonstrates full-stack development concepts including authentication, database design, API development, frontend engineering, analytics, and business workflow management.

---

## Team

* Harini – UI Developer, System Integration Lead & Project Coordinator
* Lasya – Frontend Developer
* Suguna – Backend Developer
* Samhitha – Authentication & Security Developer
* Pranathi – Database & MongoDB Developer

---

## License

This project was developed as part of an internship-based academic learning initiative.

## 🚀 Live Demo

Frontend:
https://multi-tenant-ecommerce-ochre.vercel.app

Backend:
https://vshop-y49r.onrender.com
