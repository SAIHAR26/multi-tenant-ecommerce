export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const clearSavedSession = () => {
  localStorage.removeItem("vshopToken");
  localStorage.removeItem("vshopUser");
};

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
    const {
      headers: optionHeaders = {},
      skipAuthRedirect = false,
      ...requestOptions
    } = options;
    const token = localStorage.getItem("vshopToken");
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers: {
        "Content-Type": "application/json",
        ...optionHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const message = await getErrorMessage(response, fallbackMessage);

      const isAuthRequest = path.startsWith("/api/auth/");
      if (response.status === 401 && !isAuthRequest && !skipAuthRedirect) {
        clearSavedSession();
        window.dispatchEvent(new Event("vshop:session-expired"));
      }

      throw new Error(
        response.status === 401 && !isAuthRequest && !skipAuthRedirect
          ? "Session expired. Please login again."
          : message
      );
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
