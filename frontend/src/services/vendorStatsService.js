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

      return getFallbackVendorStats();
    } catch (error) {
      console.error(
        "Vendor stats error:",
        error
      );

      return getFallbackVendorStats();
    }
  };