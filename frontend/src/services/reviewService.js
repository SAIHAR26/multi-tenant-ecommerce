import { apiRequest } from "../api/client";

export const getReviews = async () => {
  return apiRequest("/api/reviews", {}, "Reviews could not be loaded.");
};
