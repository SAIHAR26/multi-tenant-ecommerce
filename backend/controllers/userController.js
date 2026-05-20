const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch users.",
    });
  }
};

const getProfile = (req, res) => {
  res.send("User Profile API");
};

module.exports = {
  getUsers,
  getProfile,
};
