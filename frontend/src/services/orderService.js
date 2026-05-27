import { apiRequest } from "../api/client";

export const getOrders = async () => {
  try {
    return await apiRequest(
      "/api/orders",
      {},
      "Orders could not be loaded."
    );

  } catch (error) {
    console.error(
      "Order fetch error:",
      error
    );

    throw error;
  }
};

export const createOrder = async (payload) => {
  return apiRequest(
    "/api/orders",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Order could not be created."
  );
};

export const getOrderTracking = async (orderId) => {
  try {
    if (!orderId || orderId === "current-order") {
      const data = await getOrders();
      const orders = Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data)
        ? data
        : [];

      if (!orders.length) {
        throw new Error("No orders are available for tracking.");
      }

      return orders[0];
    }

    return await apiRequest(
      `/api/orders/${orderId}`,
      {},
      "Order tracking could not be loaded."
    );

  } catch (error) {
    console.error(
      "Order tracking fetch error:",
      error
    );

    throw error;
  }
};

export const exportOrders = async (filters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const token = localStorage.getItem("vshopToken");
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiBaseUrl}/api/orders/export?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error("Order export could not be generated.");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const fileNameMatch = disposition.match(/filename="(.+)"/);

  return {
    blob,
    fileName: fileNameMatch?.[1] || `VSHOP_Orders.${filters.format || "csv"}`,
  };
};

export const downloadInvoice = (order) => {
  const products = order?.products || [];
  const lines = products
    .map((item) => {
      const product = item.productId || {};
      const quantity = Number(item.quantity) || 1;
      const amount = Number(product.price || 0) * quantity;

      return `
        <tr>
          <td>${product.name || "Product"}</td>
          <td>${quantity}</td>
          <td>Rs ${Number(product.price || 0).toLocaleString("en-IN")}</td>
          <td>Rs ${amount.toLocaleString("en-IN")}</td>
        </tr>`;
    })
    .join("");

  const html = `
    <html>
      <head><title>V SHOP Invoice</title></head>
      <body style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>V SHOP Invoice</h1>
        <p><strong>Order:</strong> ${order?._id || order?.id || ""}</p>
        <p><strong>Date:</strong> ${new Date(order?.createdAt || Date.now()).toLocaleString("en-IN")}</p>
        <p><strong>Status:</strong> ${order?.status || "PROCESSING"}</p>
        <p><strong>Payment:</strong> ${order?.paymentStatus || "PENDING"}</p>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-top: 18px;">
          <thead><tr><th align="left">Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
          <tbody>${lines}</tbody>
        </table>
        <p>Subtotal: Rs ${Number(order?.subtotal || 0).toLocaleString("en-IN")}</p>
        <p>Discount: Rs ${Number(order?.discountAmount || 0).toLocaleString("en-IN")}</p>
        <p>Delivery: Rs ${Number(order?.deliveryCharge || 0).toLocaleString("en-IN")}</p>
        <h2>Total: Rs ${Number(order?.totalAmount || 0).toLocaleString("en-IN")}</h2>
      </body>
    </html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `VSHOP_Invoice_${order?._id || "order"}.html`;
  link.click();
  URL.revokeObjectURL(url);
};
