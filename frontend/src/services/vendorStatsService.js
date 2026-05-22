import { apiRequest } from "../api/client";

const fallbackStats = [
  { label: "Total Products", value: "0", trend: "Waiting for API", icon: "PR" },
  { label: "Total Revenue", value: "Rs 0", trend: "Waiting for API", icon: "RV" },
  { label: "Total Orders", value: "0", trend: "Waiting for API", icon: "OR" },
  { label: "Average Reviews", value: "0.0", trend: "Waiting for API", icon: "RW" },
  { label: "Growth", value: "0%", trend: "Waiting for API", icon: "GR" },
];

export const getVendorStats = async () => {
  const data = await apiRequest(
    "/api/vendor/stats",
    {},
    "Unable to load vendor statistics."
  );

  if (Array.isArray(data?.stats)) return data.stats;
  if (Array.isArray(data)) return data;

  return [
    { label: "Revenue", value: data?.revenue ?? "Rs 0", trend: data?.revenueTrend ?? "Live API", icon: "RV" },
    { label: "Orders", value: data?.orders ?? 0, trend: data?.ordersTrend ?? "Live API", icon: "OR" },
    { label: "Reviews", value: data?.reviews ?? 0, trend: data?.reviewsTrend ?? "Live API", icon: "RW" },
    { label: "Growth", value: data?.growth ?? "0%", trend: data?.growthTrend ?? "Live API", icon: "GR" },
  ];
};

export const getFallbackVendorStats = () => fallbackStats;
