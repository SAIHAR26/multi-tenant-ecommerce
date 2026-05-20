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
