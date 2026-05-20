import { apiRequest } from "../api/client";

export const getProducts = async () => {
  return apiRequest(
    "/api/products",
    {},
    "Products could not be loaded."
  );
};

export const getProductById = async (id) => {
  return apiRequest(
    `/api/products/${id}`,
    {},
    "Product could not be loaded."
  );
};