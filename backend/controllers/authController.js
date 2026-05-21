const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");
const Store = require("../models/Store");
const User = require("../models/User");

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

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
      store: user.store,
    },
  });
};

const registerUser = async (req, res) => {
  try {
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

    if (role === "vendor" && (!storeName || !storeCategory)) {
      return res.status(400).json({ message: "Store name and category are required for vendor registration." });
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
    });

    if (role === "vendor") {
      const store = await Store.create({
        vendorId: user._id,
        storeName,
        storeCategory,
        storeDescription: `${storeName} on V SHOP`,
        location,
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
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `This account is registered as ${user.role}.` });
    }

    sendAuthResponse(res, 200, user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed." });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
