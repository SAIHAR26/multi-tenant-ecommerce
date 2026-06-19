const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    role: {
      type: String,
      enum: ["admin", "vendor", "customer", "all"],
      default: "all",
      index: true,
    },

    type: {
      type: String,
      enum: [
        "INFO",
        "SUCCESS",
        "WARNING",
        "ERROR",
        "ORDER",
        "PAYMENT",
        "REVIEW",
        "PRODUCT",
        "SYSTEM",
        "PROMOTION",
        "vendor",
        "order",
        "review",
        "payment",
        "customer",
        "system",
      ],
      required: true,
      default: "SYSTEM",
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
      enum: [
        "INFO",
        "SUCCESS",
        "WARNING",
        "ERROR",
        "ORDER",
        "PAYMENT",
        "REVIEW",
        "PRODUCT",
        "SYSTEM",
        "PROMOTION",
        "vendor",
        "order",
        "review",
        "payment",
        "customer",
        "system",
      ],
      default: "SYSTEM",
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

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    relatedEntityModel: {
      type: String,
      trim: true,
      default: "",
    },

    actionUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.pre("validate", function syncNotificationAliases() {
  if (this.role === "all" && this.targetRole && this.targetRole !== "all") {
    this.role = this.targetRole;
  }

  if ((!this.targetRole || this.targetRole === "all") && this.role && this.role !== "all") {
    this.targetRole = this.role;
  }

  if (this.isModified("isRead")) {
    this.read = this.isRead;
  } else if (this.isModified("read")) {
    this.isRead = this.read;
  }

  if (!this.notificationCategory) {
    this.notificationCategory = this.type;
  }
});

notificationSchema.index({ userId: 1, role: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, role: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
