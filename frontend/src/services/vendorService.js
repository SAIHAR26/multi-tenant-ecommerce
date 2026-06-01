import { apiRequest } from "../api/client";
import { updateOrderStatus } from "./orderService";

export const getVendorDashboard = async () =>
  apiRequest("/api/vendor/dashboard", {}, "Vendor dashboard could not be loaded.");

export const getVendorStats = async () =>
  apiRequest("/api/vendor/stats", {}, "Vendor statistics could not be loaded.");

export const getVendorProducts = async () =>
  apiRequest("/api/vendor/products", {}, "Vendor products could not be loaded.");

export const createVendorProduct = async (product) =>
  apiRequest(
    "/api/vendor/products",
    {
      method: "POST",
      body: JSON.stringify(product),
    },
    "Vendor product could not be created."
  );

export const updateVendorProduct = async (id, product) =>
  apiRequest(
    `/api/vendor/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(product),
    },
    "Vendor product could not be updated."
  );

export const deleteVendorProduct = async (id) =>
  apiRequest(
    `/api/vendor/products/${id}`,
    {
      method: "DELETE",
    },
    "Vendor product could not be deleted."
  );

export const getVendorOrders = async () =>
  apiRequest("/api/vendor/orders", {}, "Vendor orders could not be loaded.");

export const updateVendorOrderStatus = async (orderId, status) =>
  updateOrderStatus(orderId, status, "Updated by vendor fulfillment");

export const getVendorReviews = async () =>
  apiRequest("/api/vendor/reviews", {}, "Vendor reviews could not be loaded.");

export const replyToVendorReview = async (id, reply) =>
  apiRequest(
    `/api/vendor/reviews/${id}/reply`,
    {
      method: "PATCH",
      body: JSON.stringify({ reply }),
    },
    "Vendor reply could not be saved."
  );

export const getVendorRevenue = async () =>
  apiRequest("/api/vendor/revenue", {}, "Vendor revenue could not be loaded.");

export const getVendorAnalytics = async () =>
  apiRequest("/api/vendor/analytics", {}, "Vendor analytics could not be loaded.");

export const getVendorStore = async () =>
  apiRequest("/api/vendor/store", {}, "Vendor store could not be loaded.");

export const updateVendorStore = async (store) =>
  apiRequest(
    "/api/vendor/store",
    {
      method: "PUT",
      body: JSON.stringify(store),
    },
    "Vendor store could not be updated."
  );

export const getVendorNotifications = async () =>
  apiRequest("/api/vendor/notifications", {}, "Vendor notifications could not be loaded.");

export const markVendorNotificationRead = async (id) =>
  apiRequest(
    `/api/vendor/notifications/${id}/read`,
    { method: "PATCH" },
    "Vendor notification could not be marked as read."
  );
