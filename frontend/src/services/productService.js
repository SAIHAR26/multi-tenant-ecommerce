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

export const createProduct = async (product) => {
  return apiRequest(
    "/api/products",
    {
      method: "POST",
      body: JSON.stringify(product),
    },
    "Product could not be created."
  );
};

export const updateProduct = async (id, product) => {
  return apiRequest(
    `/api/products/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(product),
    },
    "Product could not be updated."
  );
};

export const deleteProduct = async (id) => {
  return apiRequest(
    `/api/products/${id}`,
    {
      method: "DELETE",
    },
    "Product could not be deleted."
  );
};
