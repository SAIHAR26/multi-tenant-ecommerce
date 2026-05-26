const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: ["vendor", "order", "review", "payment", "customer", "system"],
      required: true,
      default: "system",
      index: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    notificationCategory: {
      type: String,
      enum: ["vendor", "order", "review", "payment", "customer", "system"],
      default: "system",
    },

    targetRole: {
      type: String,
      enum: ["admin", "vendor", "customer", "all"],
      default: "all",
      index: true,
    },

    sender: {
      type: String,
      trim: true,
      default: "V SHOP",
    },

    preview: {
      type: String,
      trim: true,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
