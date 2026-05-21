const express = require("express");

const router = express.Router();

const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");


// GET ALL ORDERS + CREATE ORDER

router.route("/")
  .get(getOrders)
  .post(createOrder);


// GET SINGLE ORDER + UPDATE + DELETE

router.route("/:id")
  .get(getOrderById)
  .patch(updateOrder)
  .delete(deleteOrder);


module.exports = router;