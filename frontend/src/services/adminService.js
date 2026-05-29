import { apiRequest } from "../api/client";

export const searchAdmin = async (query) => {
  const params = new URLSearchParams({ q: query });
  return apiRequest(`/api/admin/search?${params.toString()}`, {}, "Search could not be completed.");
};

export const getAdminProfile = async () => {
  return apiRequest("/api/admin/profile", {}, "Admin profile could not be loaded.");
};

export const updateAdminProfile = async (payload) => {
  return apiRequest(
    "/api/admin/profile",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    "Admin profile could not be updated."
  );
};
