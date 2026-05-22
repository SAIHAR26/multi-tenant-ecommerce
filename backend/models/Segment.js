const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    category: {
      type: String,
    },

    type: {
      type: String,
      enum: ["VIP", "NEW", "FREQUENT", "INACTIVE"],
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Segment", segmentSchema);