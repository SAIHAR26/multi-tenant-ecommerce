const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
=======
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
    type: {
      type: String,
      enum: ["vendor", "order", "review", "payment", "customer", "system"],
      default: "system",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    },
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD
module.exports = mongoose.model("Notification", notificationSchema);
=======
module.exports = mongoose.model("Notification", notificationSchema);
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
