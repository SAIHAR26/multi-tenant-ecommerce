import { apiRequest } from "../api/client";

const normalizeCartPayload = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart)) return data.cart;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  return [];
};

export const getCartItems = async () => {
  const data = await apiRequest(
    "/api/cart",
    {},
    "Unable to load cart."
  );

  return normalizeCartPayload(data);
};

export const addToCart = async (product, quantity = 1) => {
  return apiRequest(
    "/api/cart",
    {
      method: "POST",
      body: JSON.stringify({
        productId: product?._id || product?.id || product?.productId,
        quantity,
        product,
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
