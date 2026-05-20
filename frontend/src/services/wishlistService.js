const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getWishlist = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/wishlist`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch wishlist"
    );
  }

  return response.json();
};

export const addToWishlist =
  async (product) => {
    const response = await fetch(
      `${API_BASE_URL}/api/wishlist`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to add wishlist"
      );
    }

    return response.json();
  };