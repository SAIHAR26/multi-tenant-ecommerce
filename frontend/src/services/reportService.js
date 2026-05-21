const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const generateReport =
  async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/reports`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to generate report"
      );
    }

    return response.json();
  };