import { apiRequest } from "../api/client";

export const getStores = async () => {
  return apiRequest("/api/store", {}, "Stores could not be loaded.");
};
