const Notification = require("../models/Notification");
const Order = require("../models/Order");
require("../models/User");
require("../models/Product");
require("../models/Store");

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
  const cells = rows.map((row) => `
    <tr>
      <td>${row.orderId}</td>
      <td>${row.customer}</td>
      <td>${row.vendor}</td>
      <td>${row.status}</td>
      <td>${row.payment}</td>
      <td>${row.date}</td>
      <td>${row.amount}</td>
    </tr>`).join("");

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
    ...rows.map((row) =>
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

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price")
      .sort({ createdAt: -1 });

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
          { path: "storeId", select: "storeName" },
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
    const order = await Order.create(req.body);

    await Notification.create({
      title: "New order received",
      message: `Order ${order._id} was created for Rs ${order.totalAmount}.`,
      type: "order",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create order.",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch order.",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully.",
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
};
