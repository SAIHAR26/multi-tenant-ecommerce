const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getReviews =
  async (productId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/reviews/${productId}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch reviews"
      );
    }

    return response.json();
  };

export const createReview =
  async (reviewData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          reviewData
        ),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to create review"
      );
    }

    return response.json();
  };