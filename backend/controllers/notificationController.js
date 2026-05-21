const Notification = require("../models/Notification");

<<<<<<< HEAD

// GET ALL NOTIFICATIONS

const getNotifications = async (req, res) => {

  try {

    const notifications = await Notification.find()
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// CREATE NOTIFICATION

const createNotification = async (req, res) => {

  try {

    const newNotification = new Notification(req.body);

    const savedNotification = await newNotification.save();

    res.status(201).json({
      success: true,
      data: savedNotification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// MARK AS READ

const markAsRead = async (req, res) => {

  try {

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      {
        new: true,
      }
    );

    if (!updatedNotification) {

      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });

    }

    res.status(200).json({
      success: true,
      data: updatedNotification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// DELETE NOTIFICATION

const deleteNotification = async (req, res) => {

  try {

    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);

    if (!deletedNotification) {

      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
};
=======
const getNotifications = async (req, res) => {
  try {
    const { filter = "all" } = req.query;
    const query = {};

    if (filter === "unread") {
      query.isRead = false;
    } else if (["vendor", "order", "review", "payment", "customer", "system"].includes(filter)) {
      query.type = filter;
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch notifications.",
    });
  }
};

const createNotification = async (req, res) => {
  try {
    const { title, message, type = "system" } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required." });
    }

    const notification = await Notification.create({ title, message, type });

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create notification.",
    });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to mark notification as read.",
    });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to mark notifications as read.",
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to delete notification.",
    });
  }
};

module.exports = {
  createNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
};
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
