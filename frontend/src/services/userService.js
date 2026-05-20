const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getUserProfile =
  async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/users/profile`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch profile"
      );
    }

    return response.json();
  };
import { apiRequest } from "../api/client";

export const getUsers = async () => {
  return apiRequest("/api/users", {}, "Users could not be loaded.");
};
