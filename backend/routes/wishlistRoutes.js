const express = require("express");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { authorizeRoles, protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all wishlist routes
router.use(protect, authorizeRoles("customer"));

// Routes
router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:id", removeFromWishlist);

module.exports = router;
