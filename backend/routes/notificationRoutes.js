const express = require("express");

const {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// GET notifications
router.get("/", getNotifications);

// CREATE notification
router.post("/", createNotification);

// MARK SINGLE AS READ
router.patch("/:id/read", markNotificationRead);

// MARK ALL AS READ
router.patch("/read-all", markAllNotificationsRead);

// DELETE notification
router.delete("/:id", deleteNotification);

module.exports = router;