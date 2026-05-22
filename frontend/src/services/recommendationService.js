import { apiRequest } from "../api/client";

export const getRecommendations = async () => {
  const data = await apiRequest(
    "/api/products/recommendations",
    {},
    "Unable to load recommendations."
  );

  return {
    products: Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data)
      ? data
      : [],
    categories: Array.isArray(data?.categories) ? data.categories : [],
  };
};
