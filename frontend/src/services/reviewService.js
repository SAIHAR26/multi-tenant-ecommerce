const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/api/reviews`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};