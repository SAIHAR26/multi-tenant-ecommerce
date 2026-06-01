const Cart = require("../models/Cart");
const Order = require("../models/Order");
require("../models/User");
const Product = require("../models/Product");
require("../models/Store");
const { notifyAdmins, notifyCustomer, notifyVendor } = require("../services/notificationService");

const escapeCsv = (value) => {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const getOrderRows = (orders) =>
  orders.map((order) => {
    const products = order.products || [];
    const vendors = products
      .map((item) => item.productId?.vendor?.name || item.productId?.storeId?.storeName || "V SHOP")
      .filter(Boolean);

    return {
      orderId: order._id,
      customer: order.userId?.name || "Guest Customer",
      vendor: vendors.length ? [...new Set(vendors)].join(", ") : "V SHOP",
      status: order.status,
      payment: order.paymentStatus,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "",
      amount: order.totalAmount,
    };
  });

const getExportFileName = (format) => {
  const month = new Date().toLocaleString("en-US", { month: "short", year: "numeric" }).replace(" ", "");
  const extension = format === "excel" ? "xls" : format;
  return `VSHOP_Orders_${month}.${extension}`;
};

const buildCsv = (rows) => {
  const headers = ["Order ID", "Customer", "Vendor", "Status", "Payment", "Date", "Amount"];
  const body = rows.map((row) =>
    [row.orderId, row.customer, row.vendor, row.status, row.payment, row.date, row.amount].map(escapeCsv).join(",")
  );

  return [headers.join(","), ...body].join("\n");
};

const buildExcel = (rows) => {
  const cells = rows
    .map(
      (row) => `
    <tr>
      <td>${row.orderId}</td>
      <td>${row.customer}</td>
      <td>${row.vendor}</td>
      <td>${row.status}</td>
      <td>${row.payment}</td>
      <td>${row.date}</td>
      <td>${row.amount}</td>
    </tr>`
    )
    .join("");

  return `
    <html>
      <body>
        <table>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Vendor</th><th>Status</th><th>Payment</th><th>Date</th><th>Amount</th></tr></thead>
          <tbody>${cells}</tbody>
        </table>
      </body>
    </html>`;
};

const buildPdf = (rows) => {
  const text = [
    "V SHOP Order Export",
    "Order ID | Customer | Vendor | Status | Payment | Date | Amount",
    ...rows.map(
      (row) =>
        `${row.orderId} | ${row.customer} | ${row.vendor} | ${row.status} | ${row.payment} | ${row.date} | ${row.amount}`
    ),
  ].join("\\n");

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${text.length + 64} >> stream\nBT /F1 10 Tf 36 756 Td (${text.replace(/[()]/g, "")}) Tj ET\nendstream endobj`,
  ];

  return `%PDF-1.4\n${objects.join("\n")}\ntrailer << /Root 1 0 R >>\n%%EOF`;
};

const populateOrderQuery = (query) =>
  query
    .populate("userId", "name email")
    .populate({
      path: "products.productId",
      select: "name price images brand discount vendor storeId",
      populate: [
        { path: "vendor", select: "name email" },
        { path: "storeId", select: "storeName location storeCategory" },
      ],
    });

const getOrderVendorGroups = (orderProducts, productMap) => {
  const vendorGroups = new Map();

  for (const item of orderProducts) {
    const product = productMap.get(item.productId.toString());
    const vendorId = product?.vendor?._id?.toString() || product?.vendor?.toString();

    if (!vendorId) continue;

    const current = vendorGroups.get(vendorId) || {
      vendorId,
      storeName: product.storeId?.storeName || product.vendor?.name || "Your store",
      productNames: [],
    };

    current.productNames.push(product.name);
    vendorGroups.set(vendorId, current);
  }

  return [...vendorGroups.values()];
};

const getProductDiscount = (product, quantity) => {
  const subtotal = Number(product.price || 0) * quantity;
  const discountPercent = Math.min(Math.max(Number(product.discount || 0), 0), 100);
  return Math.round((subtotal * discountPercent) / 100);
};

const cityCoordinates = {
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  delhi: [28.6139, 77.209],
  hyderabad: [17.385, 78.4867],
  jaipur: [26.9124, 75.7873],
  kochi: [9.9312, 76.2673],
  mumbai: [19.076, 72.8777],
  pune: [18.5204, 73.8567],
};

const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceKm = (from, to) => {
  if (!from || !to) return 650;

  const earthRadiusKm = 6371;
  const latDistance = toRadians(to[0] - from[0]);
  const lngDistance = toRadians(to[1] - from[1]);
  const a =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(toRadians(from[0])) *
      Math.cos(toRadians(to[0])) *
      Math.sin(lngDistance / 2) *
      Math.sin(lngDistance / 2);

  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const findKnownCity = (value = "") => {
  const normalizedValue = value.toLowerCase();
  return Object.keys(cityCoordinates).find((city) => normalizedValue.includes(city));
};

const estimateDelivery = (products, deliveryAddress = "") => {
  const destinationCity = findKnownCity(deliveryAddress);
  const destination = cityCoordinates[destinationCity] || cityCoordinates.hyderabad;
  const vendorCities = products
    .map((product) => findKnownCity(product.storeId?.location || product.storeId?.storeName || ""))
    .filter(Boolean);
  const uniqueVendorCities = [...new Set(vendorCities)];
  const distances = uniqueVendorCities.length
    ? uniqueVendorCities.map((city) => getDistanceKm(cityCoordinates[city], destination))
    : [650];
  const distanceKm = Math.max(...distances);
  const vendorDelay = Math.max(uniqueVendorCities.length - 1, 0);
  const days =
    distanceKm <= 80
      ? 2
      : distanceKm <= 500
      ? 4
      : distanceKm <= 1200
      ? 6
      : 8;
  const deliveryEstimateDays = Math.min(10, days + vendorDelay);
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + deliveryEstimateDays);

  return {
    deliveryEstimateDays,
    deliveryDistanceKm: distanceKm,
    estimatedDeliveryDate,
  };
};

const getOrderFilters = async (req) => {
  if (!req.user) return {};

  if (req.user.role === "customer") {
    return { userId: req.user._id };
  }

  if (req.user.role === "vendor") {
    const products = await Product.find({ vendor: req.user._id }).select("_id").lean();
    return { "products.productId": { $in: products.map((product) => product._id) } };
  }

  return {};
};

const getOrders = async (req, res) => {
  try {
    const filters = await getOrderFilters(req);
    const orders = await populateOrderQuery(Order.find(filters)).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch orders.",
    });
  }
};

const exportOrders = async (req, res) => {
  try {
    const { startDate, endDate, status, vendor, customer, format = "csv" } = req.query;
    const filters = {};

    if (status && status !== "all") {
      filters.status = status.toUpperCase();
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filters)
      .populate("userId", "name email")
      .populate({
        path: "products.productId",
        select: "name vendor storeId",
        populate: [
          { path: "vendor", select: "name email" },
          { path: "storeId", select: "storeName location storeCategory" },
        ],
      })
      .sort({ createdAt: -1 });

    let rows = getOrderRows(orders);

    if (vendor) {
      rows = rows.filter((row) => row.vendor.toLowerCase().includes(vendor.toLowerCase()));
    }

    if (customer) {
      rows = rows.filter((row) => row.customer.toLowerCase().includes(customer.toLowerCase()));
    }

    const normalizedFormat = String(format).toLowerCase();
    const fileName = getExportFileName(normalizedFormat);

    if (normalizedFormat === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.status(200).send(JSON.stringify(rows, null, 2));
    }

    if (normalizedFormat === "excel") {
      res.setHeader("Content-Type", "application/vnd.ms-excel");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.status(200).send(buildExcel(rows));
    }

    if (normalizedFormat === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.status(200).send(buildPdf(rows));
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(buildCsv(rows));
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to export orders.",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const requestedProducts = Array.isArray(req.body.products) ? req.body.products : [];

    if (!requestedProducts.length) {
      return res.status(400).json({ message: "Order must contain at least one product." });
    }

    const productIds = requestedProducts.map((item) => item.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } })
      .populate("vendor", "name email")
      .populate("storeId", "storeName location storeCategory");
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    if (productMap.size !== productIds.length) {
      return res.status(400).json({ message: "One or more products are no longer available." });
    }

    let subtotal = 0;
    let discountAmount = 0;

    const orderProducts = requestedProducts.map((item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const product = productMap.get(item.productId.toString());
      subtotal += Number(product.price || 0) * quantity;
      discountAmount += getProductDiscount(product, quantity);

      return {
        productId: product._id,
        quantity,
      };
    });

    const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
    const deliveryCharge = discountedSubtotal > 0 && discountedSubtotal < 999 ? 99 : 0;
    const totalAmount = discountedSubtotal + deliveryCharge;
    const deliveryEstimate = estimateDelivery(products, req.body.deliveryAddress);

    const order = await Order.create({
      ...req.body,
      products: orderProducts,
      userId: req.user?._id || req.body.userId,
      subtotal,
      discountAmount,
      deliveryCharge,
      totalAmount,
      ...deliveryEstimate,
      trackingUpdatedAt: new Date(),
      statusHistory: [
        {
          status: "PROCESSING",
          note: `Estimated ${deliveryEstimate.deliveryEstimateDays} day delivery based on vendor and delivery address distance.`,
          updatedByRole: "system",
        },
      ],
    });

    await notifyCustomer(req.user?._id || req.body.userId, {
      title: "Order placed",
      message: `Your order ${order._id} was created for Rs ${order.totalAmount}.`,
      type: "ORDER",
      sender: "V SHOP",
      preview: "Order confirmation",
      relatedEntity: order._id,
      relatedEntityModel: "Order",
      actionUrl: "/customer/orders",
    });

    const vendorGroups = getOrderVendorGroups(orderProducts, productMap);

    await Promise.all([
      notifyAdmins({
        title: "New order created",
        message: `${req.user?.name || "A customer"} placed order ${order._id} for Rs ${order.totalAmount}.`,
        type: "ORDER",
        relatedEntity: order._id,
        relatedEntityModel: "Order",
        actionUrl: "/admin/orders",
        preview: "New marketplace order",
      }),
      ...vendorGroups.map((group) =>
        notifyVendor(group.vendorId, {
          title: "New order received",
          message: `${req.user?.name || "A customer"} bought ${group.productNames.join(", ")}. Order ${order._id}.`,
          type: "ORDER",
          sender: "V SHOP",
          preview: `${group.storeName} received a new order`,
          relatedEntity: order._id,
          relatedEntityModel: "Order",
          actionUrl: "/vendor/orders",
        })
      ),
    ]);

    await Cart.findOneAndUpdate(
      { userId: req.user?._id || req.body.userId },
      { $pull: { items: { productId: { $in: orderProducts.map((item) => item.productId) } } } }
    );

    const populatedOrder = await populateOrderQuery(Order.findById(order._id));

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create order.",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await populateOrderQuery(Order.findById(req.params.id));

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (req.user?.role === "customer" && order.userId?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (req.user?.role === "vendor") {
      const ownsProduct = order.products.some(
        (item) => item.productId?.vendor?._id?.toString() === req.user._id.toString()
      );

      if (!ownsProduct) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch order.",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await populateOrderQuery(Order.findById(req.params.id));

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const nextStatus = req.body.status;
    const allowedStatuses = ["PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (nextStatus && !allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    if (req.user?.role === "customer") {
      if (order.userId?._id?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied." });
      }

      if (nextStatus !== "CANCELLED") {
        return res.status(403).json({ message: "Customers can only cancel orders." });
      }

      if (["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status)) {
        return res.status(400).json({
          message: `Order cannot be cancelled after it is ${order.status.toLowerCase()}.`,
        });
      }
    }

    if (req.user?.role === "vendor") {
      const ownsProduct = order.products.some(
        (item) => item.productId?.vendor?._id?.toString() === req.user._id.toString()
      );

      if (!ownsProduct) {
        return res.status(403).json({ message: "Access denied." });
      }

      if (!nextStatus || nextStatus === "CANCELLED") {
        return res.status(403).json({ message: "Vendors can update fulfillment status only." });
      }

      if (order.status === "CANCELLED") {
        return res.status(400).json({ message: "Cancelled orders cannot be updated." });
      }
    }

    const updates = {
      status: nextStatus || order.status,
      paymentStatus: req.user?.role === "admin" && req.body.paymentStatus ? req.body.paymentStatus : order.paymentStatus,
      trackingUpdatedAt: new Date(),
      $push: {
        statusHistory: {
          status: nextStatus || order.status,
          note: req.body.note || "",
          updatedByRole: req.user?.role || "system",
        },
      },
    };

    const updatedOrder = await populateOrderQuery(
      Order.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      })
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (nextStatus) {
      const vendorIds = [
        ...new Set(
          updatedOrder.products
            .map((item) => item.productId?.vendor?._id?.toString() || item.productId?.vendor?.toString())
            .filter(Boolean)
        ),
      ];

      await Promise.all([
        notifyCustomer(updatedOrder.userId?._id || updatedOrder.userId, {
          title: nextStatus === "CANCELLED" ? "Order cancelled" : "Order status updated",
          message: `Order ${updatedOrder._id} is now ${nextStatus}.`,
          type: "ORDER",
          sender: req.user?.role === "vendor" ? "Vendor fulfillment" : "V SHOP",
          preview: `Order ${nextStatus.toLowerCase()}`,
          relatedEntity: updatedOrder._id,
          relatedEntityModel: "Order",
          actionUrl: "/customer/orders",
        }),
        notifyAdmins({
          title: nextStatus === "CANCELLED" ? "Order cancelled" : "Order status changed",
          message: `Order ${updatedOrder._id} is now ${nextStatus}.`,
          type: "ORDER",
          relatedEntity: updatedOrder._id,
          relatedEntityModel: "Order",
          actionUrl: "/admin/orders",
          preview: `Order ${nextStatus.toLowerCase()}`,
        }),
        ...vendorIds.map((vendorId) =>
          notifyVendor(vendorId, {
            title: nextStatus === "CANCELLED" ? "Order cancelled" : "Order status changed",
            message: `Order ${updatedOrder._id} is now ${nextStatus}.`,
            type: "ORDER",
            relatedEntity: updatedOrder._id,
            relatedEntityModel: "Order",
            actionUrl: "/vendor/orders",
            preview: `Order ${nextStatus.toLowerCase()}`,
          })
        ),
      ]);
    }

    if (req.user?.role === "admin" && req.body.paymentStatus === "PAID" && order.paymentStatus !== "PAID") {
      await Promise.all([
        notifyCustomer(updatedOrder.userId?._id || updatedOrder.userId, {
          title: "Payment successful",
          message: `Payment for order ${updatedOrder._id} was successful.`,
          type: "PAYMENT",
          relatedEntity: updatedOrder._id,
          relatedEntityModel: "Order",
          actionUrl: "/customer/orders",
          preview: "Payment confirmed",
        }),
        notifyAdmins({
          title: "Payment successful",
          message: `Payment was completed for order ${updatedOrder._id}.`,
          type: "PAYMENT",
          relatedEntity: updatedOrder._id,
          relatedEntityModel: "Order",
          actionUrl: "/admin/orders",
          preview: "Payment received",
        }),
      ]);
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to update order.",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (req.user?.role === "customer") {
      if (order.userId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied." });
      }

      if (["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status)) {
        return res.status(400).json({
          message: `Order cannot be cancelled after it is ${order.status.toLowerCase()}.`,
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    if (req.user?.role === "customer") {
      await Promise.all([
        notifyCustomer(req.user._id, {
          title: "Order cancelled",
          message: `Order ${order._id} was cancelled and removed from your orders.`,
          type: "ORDER",
          sender: "V SHOP",
          preview: "Order removed",
          relatedEntity: order._id,
          relatedEntityModel: "Order",
          actionUrl: "/customer/orders",
        }),
        notifyAdmins({
          title: "Order cancelled",
          message: `Customer cancelled order ${order._id}.`,
          type: "ORDER",
          relatedEntity: order._id,
          relatedEntityModel: "Order",
          actionUrl: "/admin/orders",
          preview: "Customer cancellation",
        }),
      ]);
    }

    res.status(200).json({
      message: req.user?.role === "customer" ? "Order cancelled and deleted successfully." : "Order deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete order.",
    });
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  exportOrders,
  getOrderById,
  getOrders,
  updateOrder,
};
