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
      enum: ["ORDER", "PAYMENT", "STORE", "REVIEW", "SYSTEM"],
      required: true,
    },


    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },


    isRead: {
      type: Boolean,
      default: false,

    type: {
      type: String,
      enum: ["vendor", "order", "review", "payment", "customer", "system"],
      default: "system",
      index: true,
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

module.exports = mongoose.model("Notification", notificationSchema);

