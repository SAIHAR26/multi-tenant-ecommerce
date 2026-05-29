const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    age: {
      type: Number,
      min: 0,
    },

    store: {
      storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
      name: {
        type: String,
        trim: true,
        default: "",
      },
      category: {
        type: String,
        trim: true,
        default: "",
      },
      bankDetails: {
        type: String,
        trim: true,
        default: "",
      },
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

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// COMPARE PASSWORD
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
