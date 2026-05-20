const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getCartItems = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cart items");
  }

  return response.json();
};

export const addToCart = async (product) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add to cart");
  }

  return response.json();
};

export const removeFromCart = async (
  id
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove item");
  }

  return response.json();
};