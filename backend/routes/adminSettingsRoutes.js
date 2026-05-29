const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("../controllers/adminSettingsController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router
  .route("/")
  .get(getSettings)
  .put(updateSettings);

module.exports = router;
