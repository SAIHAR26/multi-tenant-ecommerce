const Notification = require("../models/Notification");

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
    const { title, message, type = "system", userId = null } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required." });
    }

    const notification = await Notification.create({ title, message, type, userId });

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
