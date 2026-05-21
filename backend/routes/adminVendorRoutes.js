const express = require("express");
const {
  approveVendor,
  getVendorApprovalRequests,
  getVendorDetails,
  rejectVendor,
} = require("../controllers/adminVendorController");
const { authorizeRoles, protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/pending", getVendorApprovalRequests);
router.get("/:id", getVendorDetails);
router.patch("/:id/approve", approveVendor);
router.patch("/:id/reject", rejectVendor);

module.exports = router;
