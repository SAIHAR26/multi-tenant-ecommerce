const getOrders = (req, res) => {
  res.json({
    message: "Orders fetched",
  });
};

const createOrder = (req, res) => {
  res.json({
    message: "Order created",
  });
};

module.exports = {
  getOrders,
  createOrder,
};