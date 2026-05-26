import { apiRequest } from "../api/client";

const normalizeCartPayload = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart)) return data.cart;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  return [];
};

export const getCartItems = async (options = {}) => {
  const data = await apiRequest(
    "/api/cart",
    options,
    "Unable to load cart."
  );

  return normalizeCartPayload(data);
};

export const addToCart = async (product, quantity = 1) => {
  // FIX: If product is a string, use it directly. Otherwise, extract the ID.
  const resolvedProductId = typeof product === "string" 
    ? product 
    : (product?._id || product?.id || product?.productId);

  return apiRequest(
    "/api/cart",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: resolvedProductId,
        quantity,
      }),
    },
    "Unable to add item to cart."
  );
};

export const removeFromCart = async (id) => {
  return apiRequest(
    `/api/cart/${id}`,
    {
      method: "DELETE",
    },
    "Unable to remove item from cart."
  );
};