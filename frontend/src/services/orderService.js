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
