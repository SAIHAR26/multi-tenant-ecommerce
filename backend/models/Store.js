const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    storeDescription: {
      type: String,
      required: true,
      trim: true,
    },

    storeCategory: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    storeLogo: {
      type: String,
      required: false,
    },

    storeBanner: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Store", storeSchema);