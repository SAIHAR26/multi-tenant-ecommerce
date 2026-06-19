const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Store = require("../models/Store");
const User = require("../models/User");
const { notifyAdmins, notifyCustomer } = require("../services/notificationService");

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

const isBcryptHash = (value = "") => /^\$2[aby]\$\d{2}\$/.test(value);

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const normalizePhone = (phone = "") => String(phone).trim();

const isStrongPassword = (password = "") =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone = "") => !phone || /^[0-9+\-\s()]{7,20}$/.test(phone);

const hashResetToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

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
      isActive: user.isActive,
      isApproved: user.isApproved,
      approvalStatus: user.approvalStatus,
      rejectionReason: user.rejectionReason,
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

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    if (!name || !normalizedEmail || !password || !confirmPassword) {
      return res.status(400).json({ message: "Name, email, password, and confirm password are required." });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({ message: "Enter a valid phone number." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
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

    const duplicateQuery = normalizedPhone
      ? { $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] }
      : { email: normalizedEmail };
    const existingUser = await User.findOne(duplicateQuery);

    if (existingUser) {
      return res.status(409).json({ message: "An account already exists with this email or phone." });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
      phone: normalizedPhone,
      location,
      age: age ? Number(age) : undefined,
      isApproved: role === "customer",
      approvalStatus: role === "vendor" ? "pending" : "approved",
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

      await notifyAdmins({
        title: "New vendor registration",
        message: `${storeName} registered and is awaiting approval.`,
        type: "INFO",
        relatedEntity: user._id,
        relatedEntityModel: "User",
        actionUrl: "/admin/vendor-approvals",
        preview: "Vendor application requires review",
      });
    } else {
      await Promise.all([
        notifyCustomer(user._id, {
          title: "Welcome to V SHOP",
          message: "Your account has been created successfully.",
          type: "SUCCESS",
          relatedEntity: user._id,
          relatedEntityModel: "User",
          actionUrl: "/customer/profile",
          preview: "Account created",
        }),
        notifyAdmins({
          title: "New customer registration",
          message: `${user.name} joined the platform.`,
          type: "INFO",
          relatedEntity: user._id,
          relatedEntityModel: "User",
          actionUrl: "/admin/customers",
          preview: "New customer joined",
        }),
      ]);
    }

    sendAuthResponse(res, 201, user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed." });
  }
};

const loginUser = async (req, res) => {
  try {
    if (!requireDatabaseConnection(res)) return;

    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

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

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive. Contact support." });
    }

    user.lastLogin = new Date();
    await user.save();

    sendAuthResponse(res, 200, user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed." });
  }
};

const getCurrentUser = async (req, res) => {
  sendAuthResponse(res, 200, req.user);
};

const forgotPassword = async (req, res) => {
  try {
    if (!requireDatabaseConnection(res)) return;

    const email = normalizeEmail(req.body.email);

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required." });
    }

    const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(200).json({ message: "If an account exists, a reset token has been generated." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashResetToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Password reset token generated. Use it within 15 minutes.",
      ...(process.env.NODE_ENV === "production" ? {} : { resetToken }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Password reset request failed." });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (!requireDatabaseConnection(res)) return;

    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: "Token, password, and confirm password are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    const user = await User.findOne({
      passwordResetToken: hashResetToken(token),
      passwordResetExpires: { $gt: new Date() },
    }).select("+password +passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or expired." });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Password reset failed." });
  }
};

module.exports = {
  forgotPassword,
  getCurrentUser,
  loginUser,
  registerUser,
  resetPassword,
};
