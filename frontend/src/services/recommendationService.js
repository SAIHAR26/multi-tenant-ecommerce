
import { apiRequest } from "../api/client";

// FALLBACK RECOMMENDATIONS
const fallbackRecommendations = {
  products: [],
  categories: [],
};

// NORMALIZE RESPONSE
const normalizeRecommendations =
  (data) => {
    return {
      products: Array.isArray(
        data?.products
      )
        ? data.products
        : Array.isArray(data?.recommendations)
        ? data.recommendations
        : Array.isArray(data?.data?.products)
        ? data.data.products
        : Array.isArray(data)
        ? data
        : [],

      categories: Array.isArray(
        data?.categories
      )
        ? data.categories
        : Array.isArray(data?.data?.categories)
        ? data.data.categories
        : [],
    };
  };

// GET RECOMMENDATIONS
export const getRecommendations =
  async () => {
    try {
      const data =
        await apiRequest(
          "/api/products/recommendations",
          { skipAuthRedirect: true },
          "Unable to load recommendations."
        );

      return normalizeRecommendations(
        data
      );
    } catch (error) {
      console.error(
        "Recommendation fallback activated:",
        error
      );

      return fallbackRecommendations;
    }
  };
