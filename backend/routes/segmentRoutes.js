const express = require("express");

const {
  createSegment,
  deleteSegment,
  getSegmentById,
  getSegments,
} = require("../controllers/segmentController");

const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.use(protect, authorizeRoles("admin"));

router.post("/", createSegment);
router.get("/", getSegments);
router.get("/:id", getSegmentById);
router.delete("/:id", deleteSegment);

module.exports = router;
