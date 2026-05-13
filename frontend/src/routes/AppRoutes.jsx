import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CustomerDashboard from "../pages/CustomerDashboard";
import AdminLayout from "../layouts/AdminLayout";
import VendorLayout from "../layouts/VendorLayout";
import AdminOverview from "../pages/admin/AdminOverview";
import VendorsPage from "../pages/admin/VendorsPage";
import CustomersPage from "../pages/admin/CustomersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import AnalyticsPage from "../pages/admin/AnalyticsPage";
import ReviewsPage from "../pages/admin/ReviewsPage";
import PaymentsPage from "../pages/admin/PaymentsPage";
import SettingsPage from "../pages/admin/SettingsPage";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorProductsPage from "../pages/vendor/VendorProductsPage";
import VendorAddProductPage from "../pages/vendor/VendorAddProductPage";
import VendorOrdersPage from "../pages/vendor/VendorOrdersPage";
import VendorReviewsPage from "../pages/vendor/VendorReviewsPage";
import VendorRevenuePage from "../pages/vendor/VendorRevenuePage";
import VendorAnalyticsPage from "../pages/vendor/VendorAnalyticsPage";
import VendorSettingsPage from "../pages/vendor/VendorSettingsPage";

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
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="products" element={<VendorProductsPage />} />
          <Route path="add-product" element={<VendorAddProductPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="reviews" element={<VendorReviewsPage />} />
          <Route path="revenue" element={<VendorRevenuePage />} />
          <Route path="analytics" element={<VendorAnalyticsPage />} />
          <Route path="settings" element={<VendorSettingsPage />} />
        </Route>
        <Route path="/customer" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
