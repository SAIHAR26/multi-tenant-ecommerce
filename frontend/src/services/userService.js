import { apiRequest } from "../api/client";

export const getUsers = async () => {
  return apiRequest("/api/users", {}, "Users could not be loaded.");
};
