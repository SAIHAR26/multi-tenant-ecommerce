const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getOrders = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch orders"
    );
  }

  return response.json();
};

export const getOrderTracking =
  async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/orders/${id}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch tracking"
      );
    }

    return response.json();
  };