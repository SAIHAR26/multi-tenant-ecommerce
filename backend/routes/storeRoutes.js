const express = require("express");

const router = express.Router();
const { authorizeRoles, protect, requireApprovedVendor } = require("../middlewares/authMiddleware");

const {
  createStore,
  getStores,
  updateStore,
} = require("../controllers/storeController");

router.post("/", protect, authorizeRoles("admin", "vendor"), requireApprovedVendor, createStore);

router.get("/", getStores);

router.put("/:id", protect, authorizeRoles("admin", "vendor"), requireApprovedVendor, updateStore);

module.exports = router;
