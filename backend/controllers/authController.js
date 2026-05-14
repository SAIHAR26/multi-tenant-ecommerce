const jwt = require("jsonwebtoken");
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

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!["customer", "vendor"].includes(role)) {
      return res.status(400).json({ message: "Invalid registration role." });
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
