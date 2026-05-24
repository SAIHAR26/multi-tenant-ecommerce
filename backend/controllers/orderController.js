const placeOrder = (req, res) => {
  res.send("Place Order API");
};

const getMyOrders = (req, res) => {
  res.send("My Orders API");
};

const getAllOrders = (req, res) => {
  res.send("All Orders API");
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
};