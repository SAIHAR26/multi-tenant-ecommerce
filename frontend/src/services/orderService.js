import { apiRequest } from "../api/client";

export const getOrders = async () => {
  return apiRequest("/api/orders", {}, "Orders could not be loaded.");
};
