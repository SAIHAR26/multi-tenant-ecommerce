const express = require("express");

const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
} = require("../controllers/cartController");

router.get("/", getCart);

router.post("/", addToCart);

router.patch("/", updateCart);

router.delete("/:id", deleteCart);

module.exports = router;