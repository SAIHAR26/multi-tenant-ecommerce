import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VendorDashboard from "../pages/VendorDashboard";
import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminOverview from "../pages/admin/AdminOverview";
import VendorsPage from "../pages/admin/VendorsPage";
import CustomersPage from "../pages/admin/CustomersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import AnalyticsPage from "../pages/admin/AnalyticsPage";
import ReviewsPage from "../pages/admin/ReviewsPage";
import PaymentsPage from "../pages/admin/PaymentsPage";
import SettingsPage from "../pages/admin/SettingsPage";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import WishlistPage from "../pages/customer/WishlistPage";
import CartPage from "../pages/customer/CartPage";
import CustomerOrdersPage from "../pages/customer/OrdersPage";
import TrackingPage from "../pages/customer/TrackingPage";
import RecommendationsPage from "../pages/customer/RecommendationsPage";
import ProfilePage from "../pages/customer/ProfilePage";
import CustomerSettingsPage from "../pages/customer/SettingsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<CustomerSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
