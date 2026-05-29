const express = require("express");

const {
  createNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} = require("../controllers/notificationController");
const { authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

// GET notifications
router.get("/", getNotifications);

// CREATE notification
router.post("/", authorizeRoles("admin"), createNotification);

// MARK SINGLE AS READ
router.patch("/:id/read", markNotificationRead);

// MARK ALL AS READ
router.patch("/read-all", markAllNotificationsRead);

// DELETE notification
router.delete("/:id", deleteNotification);

module.exports = router;
