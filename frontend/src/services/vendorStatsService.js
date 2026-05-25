import { apiRequest } from "../api/client";

// FALLBACK STATS
export const getFallbackVendorStats =
  () => [
    {
      label: "Total Revenue",
      value: "₹2.4L",
      change: "+18%",
    },

    {
      label: "Orders",
      value: "1,284",
      change: "+12%",
    },

    {
      label: "Products",
      value: "86",
      change: "+6%",
    },

    {
      label: "Customers",
      value: "542",
      change: "+21%",
    },
  ];

const formatCurrency = (value = 0) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const normalizeVendorStats = (stats = {}) => [
  {
    label: "Total Revenue",
    value: formatCurrency(stats.revenue),
    trend: "From vendor orders",
    icon: "RV",
  },
  {
    label: "Orders",
    value: String(stats.totalOrders || 0),
    trend: "Fulfillment queue",
    icon: "OR",
  },
  {
    label: "Products",
    value: String(stats.totalProducts || 0),
    trend: "Live catalog",
    icon: "PR",
  },
  {
    label: "Customers",
    value: String(stats.totalCustomers || 0),
    trend: "Unique buyers",
    icon: "CU",
  },
];

// GET VENDOR STATS
export const getVendorStats =
  async () => {
    try {
      const data =
        await apiRequest(
          "/api/vendor/stats",
          {},
          "Unable to load vendor statistics."
        );

      if (
        Array.isArray(data)
      ) {
        return data;
      }

      if (
        Array.isArray(
          data?.stats
        )
      ) {
        return data.stats;
      }

      if (data?.stats && typeof data.stats === "object") {
        return normalizeVendorStats(data.stats);
      }

      return getFallbackVendorStats();
    } catch (error) {
      console.error(
        "Vendor stats error:",
        error
      );

      return getFallbackVendorStats();
    }
  };
