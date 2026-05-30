const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Store = require("../models/Store");
const User = require("../models/User");

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

const isBcryptHash = (value = "") => /^\$2[aby]\$\d{2}\$/.test(value);

const requireDatabaseConnection = (res) => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  res.status(503).json({
    message: "Database is not connected. Check backend/.env MONGO_URI and restart the backend.",
  });
  return false;
};

const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      age: user.age,
      avatar: user.avatar,
      store: user.store,
    },
  });
};

const registerUser = async (req, res) => {
  try {
    if (!requireDatabaseConnection(res)) return;

    const {
      name,
      email,
      password,
      confirmPassword,
      role = "customer",
      phone,
      location,
      age,
      storeName,
      storeCategory,
      storeDescription,
      businessType,
      businessAddress,
      businessRegistrationNumber,
      businessDocuments,
      gstNumber,
      panNumber,
      bankDetails,
    } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Name, email, password, and confirm password are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!["customer", "vendor"].includes(role)) {
      return res.status(400).json({ message: "Invalid registration role." });
    }

    if (
      role === "vendor" &&
      (!storeName || !storeCategory || !location || !businessType || !businessAddress || !businessRegistrationNumber)
    ) {
      return res.status(400).json({
        message:
          "Store name, category, location, business type, business address, and registration number are required for vendor registration.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "An account already exists with this email." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      location,
      age: age ? Number(age) : undefined,
      store:
        role === "vendor"
          ? {
              name: storeName,
              category: storeCategory,
              bankDetails,
            }
          : undefined,
      business:
        role === "vendor"
          ? {
              gstNumber,
              businessRegistrationNumber,
              businessType,
              businessAddress,
              businessDocuments: Array.isArray(businessDocuments)
                ? businessDocuments
                : String(businessDocuments || "")
                    .split(",")
                    .map((document) => document.trim())
                    .filter(Boolean),
              panNumber,
            }
          : undefined,
    });

    if (role === "vendor") {
      const store = await Store.create({
        vendorId: user._id,
        storeName,
        storeCategory,
        storeDescription: storeDescription || `${storeName} on V SHOP`,
        location,
        business: user.business,
      });

      user.store.storeId = store._id;
      await user.save();

      await Notification.create({
        title: "New vendor registration",
        message: `${storeName} registered and is ready for admin review.`,
        type: "vendor",
      });
    }

    sendAuthResponse(res, 201, user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed." });
  }
};

const loginUser = async (req, res) => {
  try {
    if (!requireDatabaseConnection(res)) return;

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = isBcryptHash(user.password)
      ? await user.matchPassword(password)
      : user.password === password;

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!isBcryptHash(user.password)) {
      user.password = password;
      await user.save();
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `This account is registered as ${user.role}.` });
    }

    user.lastLogin = new Date();
    await user.save();

    sendAuthResponse(res, 200, user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed." });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
