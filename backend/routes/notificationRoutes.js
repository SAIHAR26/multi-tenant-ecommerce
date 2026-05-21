const express = require("express");

<<<<<<< HEAD
const router = express.Router();

const {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");


// GET + CREATE

router.route("/")
  .get(getNotifications)
  .post(createNotification);


// MARK AS READ

router.patch("/:id/read", markAsRead);


// DELETE

router.delete("/:id", deleteNotification);


module.exports = router;
=======
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
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
