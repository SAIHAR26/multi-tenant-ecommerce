const express = require("express");

const router = express.Router();

const {
  getWishlist,
  createWishlist,
  deleteWishlist,
} = require("../controllers/wishlistController");

// GET WISHLIST
router.get("/", getWishlist);

// CREATE WISHLIST
router.post("/", createWishlist);

// DELETE WISHLIST
router.delete("/:id", deleteWishlist);

module.exports = router;