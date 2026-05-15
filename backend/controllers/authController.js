const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// REGISTER USER
const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vendor approval logic
    let isApproved = true;

    if (role === "vendor") {
      isApproved = false;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// LOGIN USER
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Vendor approval check
    if (
      user.role === "vendor" &&
      !user.isApproved
    ) {
      return res.status(403).json({
        success: false,
        message: "Vendor approval pending",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// EXPORTS
module.exports = {
  registerUser,
  loginUser,
};