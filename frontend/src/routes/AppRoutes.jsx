import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { getDashboardPath, getSavedToken, getSavedUser, logout } from "../api/auth";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

/* ================= ADMIN ================= */
import AdminLayout from "../layouts/AdminLayout";

import AdminOverview from "../pages/admin/AdminOverview";
import VendorsPage from "../pages/admin/VendorsPage";
import VendorApprovalCenter from "../pages/admin/VendorApprovalCenter";
import CustomersPage from "../pages/admin/CustomersPage";
import CreateSegmentPage from "../pages/admin/CreateSegmentPage";
import AddProductCenter from "../pages/admin/AddProductCenter";
import ExportOrdersCenter from "../pages/admin/ExportOrdersCenter";
import ProductsPage from "../pages/admin/ProductsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import AnalyticsPage from "../pages/admin/AnalyticsPage";
import ReviewsPage from "../pages/admin/ReviewsPage";
import PaymentsPage from "../pages/admin/PaymentsPage";
import ReportsPage from "../pages/admin/ReportsPage";
import SettingsPage from "../pages/admin/SettingsPage";
import AdminNotificationsPage from "../pages/admin/NotificationsPage";
import AdminProfilePage from "../pages/admin/AdminProfilePage";

/* ================= VENDOR ================= */
import VendorLayout from "../layouts/VendorLayout";

import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorProductsPage from "../pages/vendor/VendorProductsPage";
import VendorAddProductPage from "../pages/vendor/VendorAddProductPage";
import VendorOrdersPage from "../pages/vendor/VendorOrdersPage";
import VendorReviewsPage from "../pages/vendor/VendorReviewsPage";
import VendorRevenuePage from "../pages/vendor/VendorRevenuePage";
import VendorAnalyticsPage from "../pages/vendor/VendorAnalyticsPage";
import VendorSettingsPage from "../pages/vendor/VendorSettingsPage";
import VendorStoreProfilePage from "../pages/vendor/VendorStoreProfilePage";
import VendorNotificationsPage from "../pages/vendor/VendorNotificationsPage";
import VendorPendingApprovalPage from "../pages/vendor/VendorPendingApprovalPage";

/* ================= CUSTOMER ================= */
import CustomerLayout from "../layouts/CustomerLayout";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import WishlistPage from "../pages/customer/WishlistPage";
import CartPage from "../pages/customer/CartPage";
import CustomerOrdersPage from "../pages/customer/OrdersPage";
import TrackingPage from "../pages/customer/TrackingPage";
import NotificationsPage from "../pages/customer/NotificationsPage";
import RecommendationsPage from "../pages/customer/RecommendationsPage";
import ProfilePage from "../pages/customer/ProfilePage";
import CustomerSettingsPage from "../pages/customer/SettingsPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import OrderSuccessPage from "../pages/customer/OrderSuccessPage";
import ProductDetails from "../pages/customer/ProductDetails";

const isApprovedVendor = (user) =>
  user?.role === "vendor" && user?.isApproved === true && user?.approvalStatus === "approved";

function ProtectedRoute({ allowPendingVendor = false, children, roles }) {
  const token = getSavedToken();
  const user = getSavedUser();

  if (!token || !user) {
    logout();
    return <Navigate replace to="/login" />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate replace to={getDashboardPath(user.role)} />;
  }

  if (user.role === "vendor" && !allowPendingVendor && !isApprovedVendor(user)) {
    return <Navigate replace to="/vendor/pending-approval" />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="vendor-approvals" element={<VendorApprovalCenter />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customer-segments" element={<CreateSegmentPage />} />
          <Route path="customer-segments/:segmentId" element={<CreateSegmentPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="add-product" element={<AddProductCenter />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="export-orders" element={<ExportOrdersCenter />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ================= VENDOR ROUTES ================= */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowPendingVendor roles={["vendor"]}>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="pending-approval" element={<VendorPendingApprovalPage />} />
          <Route
            path="products"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-product"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorAddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="revenue"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorRevenuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="store-profile"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorStoreProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute roles={["customer"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="tracking/:id" element={<TrackingPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<CustomerSettingsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
