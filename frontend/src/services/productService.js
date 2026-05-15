const productService = {
  getProducts: async () => {
    console.log("Fetch products");
  },

  addProduct: async (data) => {
    console.log("Add product", data);
  },

  updateProduct: async (id, data) => {
    console.log("Update product", id, data);
  },

  deleteProduct: async (id) => {
    console.log("Delete product", id);
  },
};

export default productService;