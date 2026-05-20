const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Fetch all reviews for a specific product
 */
export const getReviews = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

/**
 * Submit a new product review from a customer
 */
export const addProductReview = async (productId, reviewData) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    throw new Error("Failed to submit review");
  }

  return response.json();
};