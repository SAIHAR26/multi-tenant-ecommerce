export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getErrorMessage = async (response, fallbackMessage) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const apiRequest = async (path, options = {}, fallbackMessage = "Request could not be completed.") => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, fallbackMessage));
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Backend is not reachable at ${API_BASE_URL}. Start the backend with "cd backend" then "npm run dev".`,
        { cause: error }
      );
    }

    throw error;
  }
};
