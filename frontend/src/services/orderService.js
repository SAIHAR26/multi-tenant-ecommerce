import { apiRequest } from "../api/client";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

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
