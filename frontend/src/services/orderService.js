const orderService = {
  getOrders: async () => {
    console.log("Fetch orders");
  },

  createOrder: async (data) => {
    console.log("Create order", data);
  },

  trackOrder: async (id) => {
    console.log("Track order", id);
  },
};

export default orderService;