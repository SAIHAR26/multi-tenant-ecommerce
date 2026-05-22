import { apiRequest } from "../api/client";

export const getOrders = async () => {
  try {
    return await apiRequest(
      "/api/orders",
      {},
      "Orders could not be loaded."
    );

  } catch (error) {
    console.error(
      "Order fetch error:",
      error
    );

    throw error;
  }
};

export const getOrderTracking = async (orderId) => {
  try {
    if (!orderId || orderId === "current-order") {
      const data = await getOrders();
      const orders = Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data)
        ? data
        : [];

      if (!orders.length) {
        throw new Error("No orders are available for tracking.");
      }

      return orders[0];
    }

    return await apiRequest(
      `/api/orders/${orderId}`,
      {},
      "Order tracking could not be loaded."
    );

  } catch (error) {
    console.error(
      "Order tracking fetch error:",
      error
    );

    throw error;
  }
};

export const exportOrders = async (filters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const token = localStorage.getItem("vshopToken");
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiBaseUrl}/api/orders/export?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error("Order export could not be generated.");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const fileNameMatch = disposition.match(/filename="(.+)"/);

  return {
    blob,
    fileName: fileNameMatch?.[1] || `VSHOP_Orders.${filters.format || "csv"}`,
  };
};
