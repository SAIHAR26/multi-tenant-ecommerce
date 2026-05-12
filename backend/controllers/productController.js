const getProducts = (req, res) => {
  res.send("Get Products API");
};

const addProduct = (req, res) => {
  res.send("Add Product API");
};

module.exports = {
  getProducts,
  addProduct,
};