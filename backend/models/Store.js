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
      trim: true,
      default: "",
    },

    storeCategory: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    storeLogo: {
      type: String,
      required: false,
    },

    storeBanner: {
      type: String,
      required: false,
    },

    business: {
      gstNumber: {
        type: String,
        trim: true,
        default: "",
      },
      businessRegistrationNumber: {
        type: String,
        trim: true,
        default: "",
      },
      businessType: {
        type: String,
        trim: true,
        default: "",
      },
      businessAddress: {
        type: String,
        trim: true,
        default: "",
      },
      businessDocuments: {
        type: [String],
        default: [],
      },
      panNumber: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // Vendor Analytics Fields

    totalRevenue: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    growthPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Store", storeSchema);
