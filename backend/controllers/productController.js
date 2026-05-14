const getProducts = (req, res) => {
  res.json({
    message: "Products fetched",
  });
};

const addProduct = (req, res) => {
  res.json({
    message: "Product added",
  });
};

const updateProduct = (req, res) => {
  res.json({
    message: "Product updated",
  });
};

const deleteProduct = (req, res) => {
  res.json({
    message: "Product deleted",
  });
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};