const Notification = require("../models/Notification");


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


// MARK NOTIFICATION AS READ

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