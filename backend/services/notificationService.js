const Notification = require("../models/Notification");
const User = require("../models/User");

const NOTIFICATION_TYPES = {
  INFO: "INFO",
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
  ORDER: "ORDER",
  PAYMENT: "PAYMENT",
  REVIEW: "REVIEW",
  PRODUCT: "PRODUCT",
  SYSTEM: "SYSTEM",
  PROMOTION: "PROMOTION",
};

const legacyTypeMap = {
  vendor: "INFO",
  customer: "INFO",
  order: "ORDER",
  payment: "PAYMENT",
  review: "REVIEW",
  product: "PRODUCT",
  system: "SYSTEM",
};

const normalizeType = (type = "INFO") => {
  const normalized = String(type).trim();
  return legacyTypeMap[normalized] || NOTIFICATION_TYPES[normalized.toUpperCase()] || NOTIFICATION_TYPES.INFO;
};

const normalizeRole = (role = "all") =>
  ["admin", "vendor", "customer", "all"].includes(role) ? role : "all";

const buildPayload = (payload) => {
  const role = normalizeRole(payload.role || payload.targetRole);
  const type = normalizeType(payload.type);

  return {
    userId: payload.userId || null,
    role,
    targetRole: role,
    title: payload.title,
    message: payload.message,
    type,
    notificationCategory: type,
    sender: payload.sender || "V SHOP",
    preview: payload.preview || payload.message,
    relatedEntity: payload.relatedEntity || null,
    relatedEntityModel: payload.relatedEntityModel || "",
    actionUrl: payload.actionUrl || "",
  };
};

const createNotification = async (payload, options = {}) => {
  if (!payload?.title || !payload?.message) {
    return null;
  }

  const notificationPayload = buildPayload(payload);
  const dedupeMinutes = Number(options.dedupeMinutes ?? 5);

  if (dedupeMinutes > 0) {
    const since = new Date(Date.now() - dedupeMinutes * 60 * 1000);
    const dedupeQuery = {
      userId: notificationPayload.userId,
      role: notificationPayload.role,
      type: notificationPayload.type,
      title: notificationPayload.title,
      createdAt: { $gte: since },
    };

    if (notificationPayload.relatedEntity) {
      dedupeQuery.relatedEntity = notificationPayload.relatedEntity;
    } else {
      dedupeQuery.message = notificationPayload.message;
    }

    const existing = await Notification.findOne(dedupeQuery);

    if (existing) {
      return existing;
    }
  }

  return Notification.create(notificationPayload);
};

const notifyUsersByRole = async (role, payload, options) => {
  const users = await User.find({ role, isActive: true }).select("_id").lean();

  if (!users.length) {
    return [];
  }

  return Promise.all(
    users.map((user) =>
      createNotification(
        {
          ...payload,
          role,
          targetRole: role,
          userId: user._id,
        },
        options
      )
    )
  );
};

const notifyAdmins = (payload, options) => notifyUsersByRole("admin", payload, options);

const notifyVendor = (vendorId, payload, options) =>
  vendorId
    ? createNotification(
        {
          ...payload,
          role: "vendor",
          targetRole: "vendor",
          userId: vendorId,
        },
        options
      )
    : null;

const notifyCustomer = (customerId, payload, options) =>
  customerId
    ? createNotification(
        {
          ...payload,
          role: "customer",
          targetRole: "customer",
          userId: customerId,
        },
        options
      )
    : null;

module.exports = {
  NOTIFICATION_TYPES,
  createNotification,
  normalizeType,
  notifyAdmins,
  notifyCustomer,
  notifyVendor,
};
