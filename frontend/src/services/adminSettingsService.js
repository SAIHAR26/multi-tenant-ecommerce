import { apiRequest } from "../api/client";

export const getAdminSettings = async () => {
  return apiRequest("/api/admin/settings", {}, "Admin settings could not be loaded.");
};

export const updateAdminSettings = async (settings) => {
  return apiRequest(
    "/api/admin/settings",
    {
      method: "PUT",
      body: JSON.stringify(settings),
    },
    "Admin settings could not be saved."
  );
};
