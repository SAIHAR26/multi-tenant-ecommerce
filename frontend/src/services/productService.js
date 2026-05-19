import { apiRequest } from "../api/client";

export const getProducts = async () => {
  return apiRequest("/api/products", {}, "Products could not be loaded.");
};
