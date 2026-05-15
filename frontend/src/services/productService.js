const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};