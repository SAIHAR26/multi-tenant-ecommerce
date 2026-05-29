const express = require("express");

const {
  getAdminProfile,
  searchAdmin,
  updateAdminProfile,
} = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.get("/search", searchAdmin);

module.exports = router;
