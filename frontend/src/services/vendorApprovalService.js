import { apiRequest } from "../api/client";

const getQuery = ({ status = "all", sort = "newest" } = {}) => {
  const params = new URLSearchParams();
  params.set("status", status);
  params.set("sort", sort);
  return params.toString();
};

export const getVendorApprovals = async (filters = {}) => {
  return apiRequest(
    `/api/admin/vendors/pending?${getQuery(filters)}`,
    {},
    "Vendor approval requests could not be loaded."
  );
};

export const getVendorProfile = async (id) => {
  return apiRequest(`/api/admin/vendors/${id}`, {}, "Vendor profile could not be loaded.");
};

export const approveVendor = async (id) => {
  return apiRequest(
    `/api/admin/vendors/${id}/approve`,
    { method: "PATCH" },
    "Vendor could not be approved."
  );
};

export const rejectVendor = async (id, rejectionReason) => {
  return apiRequest(
    `/api/admin/vendors/${id}/reject`,
    {
      method: "PATCH",
      body: JSON.stringify({ rejectionReason }),
    },
    "Vendor could not be rejected."
  );
};
