const express = require("express");

const { getAdminReport } = require("../controllers/reportController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAdminReport);

module.exports = router;
