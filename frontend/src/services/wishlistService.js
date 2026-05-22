import { apiRequest } from "../api/client";

const normalizeWishlistPayload = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.wishlist)) return data.wishlist;
  return [];
};

export const getWishlist = async () => {
  const data = await apiRequest(
    "/api/wishlist",
    {},
    "Unable to load wishlist."
  );

  return normalizeWishlistPayload(data);
};

export const addToWishlist = async (product) => {
  return apiRequest(
    "/api/wishlist",
    {
      method: "POST",
      body: JSON.stringify({
        productId: product?._id || product?.id || product?.productId,
        product,
      }),
    },
    "Unable to add item to wishlist."
  );
};

export const removeFromWishlist = async (id) => {
  return apiRequest(
    `/api/wishlist/${id}`,
    {
      method: "DELETE",
    },
    "Unable to remove item from wishlist."
  );
};
