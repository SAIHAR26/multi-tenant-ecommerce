import { apiRequest } from "../api/client";

// NORMALIZE WISHLIST RESPONSE
const normalizeWishlistPayload = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.wishlist)) return data.wishlist;
  return [];
};

// GET WISHLIST
export const getWishlist = async () => {
  const data = await apiRequest(
    "/api/wishlist",
    {},
    "Unable to load wishlist."
  );

  return normalizeWishlistPayload(data);
};

// ADD TO WISHLIST
export const addToWishlist = async (product) => {
  // FIX: Handle both string IDs and complete objects safely
  const resolvedProductId = typeof product === "string"
    ? product
    : (product?._id || product?.id || product?.productId);

  const payload = {
    productId: resolvedProductId,
  };

  return apiRequest(
    "/api/wishlist",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "Unable to add item to wishlist."
  );
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (id) => {
  if (!id) {
    throw new Error("Wishlist item id missing.");
  }

  return apiRequest(
    `/api/wishlist/${id}`,
    {
      method: "DELETE",
    },
    "Unable to remove item from wishlist."
  );
};