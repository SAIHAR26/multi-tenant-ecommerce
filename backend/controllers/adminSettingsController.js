const AdminSettings = require("../models/AdminSettings");

const allowedFields = [
  "displayName",
  "email",
  "workspace",
  "commissionRate",
  "reviewModeration",
  "payoutCycle",
  "requireTwoFactor",
  "sessionTimeout",
  "auditLogging",
];

const getSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      { key: "global" },
      { $setOnInsert: { key: "global" } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Admin settings could not be loaded.",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const settings = await AdminSettings.findOneAndUpdate(
      { key: "global" },
      { $set: updates, $setOnInsert: { key: "global" } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Admin settings could not be saved.",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
