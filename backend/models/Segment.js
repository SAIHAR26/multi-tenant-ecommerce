const mongoose = require("mongoose");


const conditionSchema = new mongoose.Schema(
  {
    connector: {
      type: String,
      enum: ["AND", "OR"],
      default: "AND",
    },
    field: {
      type: String,
      required: true,
      trim: true,
    },
    operator: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
  },
  { _id: false }
);


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

      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    segmentType: {
      type: String,
      required: true,
      trim: true,
    },
    conditions: {
      type: [conditionSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerCount: {
      type: Number,
      default: 0,
      min: 0,

    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Segment", segmentSchema);

module.exports = mongoose.model("Segment", segmentSchema);

