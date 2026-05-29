const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: "V SHOP Admin",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "admin@vshop.in",
    },
    workspace: {
      type: String,
      trim: true,
      default: "Founder workspace",
    },
    commissionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 12,
    },
    reviewModeration: {
      type: Boolean,
      default: true,
    },
    payoutCycle: {
      type: String,
      enum: ["Weekly", "Biweekly", "Monthly"],
      default: "Weekly",
    },
    requireTwoFactor: {
      type: Boolean,
      default: true,
    },
    sessionTimeout: {
      type: Number,
      min: 5,
      default: 30,
    },
    auditLogging: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
