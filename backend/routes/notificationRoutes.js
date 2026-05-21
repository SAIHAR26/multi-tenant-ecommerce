const express = require("express");

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