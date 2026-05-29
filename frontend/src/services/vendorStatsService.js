import { getVendorStats as fetchVendorStats } from "./vendorService";

const formatCurrency = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const formatRating = (value = 0) => Number(value || 0).toFixed(1);

export const mapVendorStats = (stats = {}) => [
  {
    label: "Total Products",
    value: String(stats.totalProducts || 0),
    trend: `${stats.lowStockProducts || 0} low stock`,
    icon: "PR",
  },
  {
    label: "Total Orders",
    value: String(stats.totalOrders || 0),
    trend: `${stats.pendingOrders || 0} pending`,
    icon: "OR",
  },
  {
    label: "Total Revenue",
    value: formatCurrency(stats.totalRevenue),
    trend: "Live MongoDB total",
    icon: "RV",
  },
  {
    label: "Average Rating",
    value: formatRating(stats.averageRating),
    trend: `${stats.totalReviews || 0} reviews`,
    icon: "RT",
  },
];

export const getFallbackVendorStats = () => mapVendorStats({});

export const getVendorStats = async () => {
  const data = await fetchVendorStats();
  return mapVendorStats(data?.stats);
};
