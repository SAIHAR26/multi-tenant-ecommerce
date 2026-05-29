const Notification = require("../models/Notification");

const allowedRoles = ["admin", "vendor", "customer"];
const allowedTypes = ["vendor", "order", "review", "payment", "customer", "system"];

const getAudienceQuery = (role, userId) => {
  const query = {};

  if (allowedRoles.includes(role)) {
    query.targetRole = { $in: [role, "all"] };
  }

  if (userId) {
    query.$or = [{ userId }, { userId: null }];
  }

  return query;
};

const getNotifications = async (req, res) => {
  try {
    const { filter = "all" } = req.query;
    const role = req.user?.role || "";
    const userId = req.user?._id || "";
    const query = getAudienceQuery(role, userId);

    if (filter === "unread") {
      query.isRead = false;
    } else if (allowedTypes.includes(filter)) {
      query.type = filter;
    }

    const notifications = await Notification.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({
      ...getAudienceQuery(role, userId),
      isRead: false,
    });

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
    const {
      title,
      message,
      type = "system",
      userId = null,
      targetRole = "all",
      sender = "V SHOP",
      preview = "",
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required." });
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      userId,
      targetRole,
      sender,
      preview,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create notification.",
    });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const role = req.user?.role || "";
    const userId = req.user?._id || "";
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        ...getAudienceQuery(role, userId),
      },
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
    const role = req.user?.role || "";
    const userId = req.user?._id || "";

    await Notification.updateMany(
      {
        ...getAudienceQuery(role, userId),
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to mark notifications as read.",
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const role = req.user?.role || "";
    const userId = req.user?._id || "";
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      ...(role === "admin" ? {} : getAudienceQuery(role, userId)),
    });

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
