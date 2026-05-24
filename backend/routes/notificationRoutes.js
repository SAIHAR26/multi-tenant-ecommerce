const express = require("express");


const router = express.Router();

const {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// GET + CREATE
router
  .route("/")
  .get(getNotifications)
  .post(createNotification);

// MARK AS READ
router.patch("/:id/read", markAsRead);

// DELETE
router.delete("/:id", deleteNotification);

module.exports = router;

const {
  createNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getNotifications);
router.post("/", createNotification);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);
router.delete("/:id", deleteNotification);

module.exports = router;

