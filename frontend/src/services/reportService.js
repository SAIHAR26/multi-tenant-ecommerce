import { apiRequest } from "../api/client";

export const getAdminReport = async () => {
  return apiRequest("/api/admin/report", {}, "Unable to generate report.");
};

export const generateReport = getAdminReport;
