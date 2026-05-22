import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportOrders, getOrders } from "../../services/orderService";

const today = new Date();
const toInputDate = (date) => date.toISOString().slice(0, 10);

const getRange = (range) => {
  const endDate = new Date();
  const startDate = new Date();

  if (range === "today") {
    return { startDate: toInputDate(startDate), endDate: toInputDate(endDate) };
  }

  if (range === "7") {
    startDate.setDate(today.getDate() - 7);
    return { startDate: toInputDate(startDate), endDate: toInputDate(endDate) };
  }

  if (range === "30") {
    startDate.setDate(today.getDate() - 30);
    return { startDate: toInputDate(startDate), endDate: toInputDate(endDate) };
  }

  return { startDate: "", endDate: "" };
};

function ExportOrdersCenter() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    range: "30",
    startDate: getRange("30").startDate,
    endDate: getRange("30").endDate,
    status: "all",
    vendor: "",
    customer: "",
    format: "csv",
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    getOrders()
      .then((data) => {
        if (!isActive) return;
        setOrders(Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : []);
      })
      .catch((loadError) => {
        if (isActive) setError(loadError.message);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : null;
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const statusMatch = filters.status === "all" || String(order.status).toLowerCase() === filters.status;
      const customerMatch = !filters.customer || String(order.userId?.name || "").toLowerCase().includes(filters.customer.toLowerCase());
      const vendorMatch = !filters.vendor || JSON.stringify(order).toLowerCase().includes(filters.vendor.toLowerCase());

      return (
        statusMatch &&
        customerMatch &&
        vendorMatch &&
        (!startDate || !orderDate || orderDate >= startDate) &&
        (!endDate || !orderDate || orderDate <= endDate)
      );
    });
  }, [filters, orders]);

  const revenue = filteredOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);

  const updateRange = (range) => {
    const nextRange = getRange(range);
    setFilters((current) => ({ ...current, range, ...nextRange }));
  };

  const downloadExport = async () => {
    setGenerating(true);
    setMessage("Generating export...");
    setError("");

    try {
      const { blob, fileName } = await exportOrders(filters);
      setMessage("Downloading...");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Export complete");
    } catch (exportError) {
      setError(exportError.message);
      setMessage("");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Order exports</p>
          <h1>Marketplace Order Export Command Center</h1>
          <p>Generate downloadable order reports.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/orders")}>
          Back to Orders
        </button>
      </section>

      {(message || error) && (
        <p className={`admin-action-status ${error ? "admin-action-status--error" : "admin-action-status--success"}`}>
          {error || message}
        </p>
      )}

      <section className="segment-command-grid">
        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Filters</p><h2>Export filters</h2></div></div>

          <div className="export-filter-grid">
            <label><span>Date Range</span><select value={filters.range} onChange={(event) => updateRange(event.target.value)}><option value="today">Today</option><option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="custom">Custom Range</option></select></label>
            <label><span>Start Date</span><input type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, range: "custom", startDate: event.target.value })} /></label>
            <label><span>End Date</span><input type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, range: "custom", endDate: event.target.value })} /></label>
            <label><span>Status</span><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="all">All statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></label>
            <label><span>Vendor filter</span><input value={filters.vendor} onChange={(event) => setFilters({ ...filters, vendor: event.target.value })} placeholder="Vendor name" /></label>
            <label><span>Customer filter</span><input value={filters.customer} onChange={(event) => setFilters({ ...filters, customer: event.target.value })} placeholder="Customer name" /></label>
          </div>

          <div className="export-radio-group">
            {["csv", "excel", "pdf", "json"].map((format) => (
              <label key={format}>
                <input type="radio" name="format" checked={filters.format === format} onChange={() => setFilters({ ...filters, format })} />
                {format.toUpperCase()}
              </label>
            ))}
          </div>

          <button className="hero-action" type="button" disabled={generating} onClick={downloadExport}>
            {generating ? "Generating export..." : "Generate File"}
          </button>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Preview</p><h2>Estimated export</h2></div></div>
          {loading ? (
            <div className="notification-state">Loading orders...</div>
          ) : (
            <div className="export-preview-stack">
              <div><span>Orders count</span><strong>{filteredOrders.length}</strong></div>
              <div><span>Revenue</span><strong>Rs {new Intl.NumberFormat("en-IN").format(revenue)}</strong></div>
              <div><span>Date range</span><strong>{filters.startDate || "Any"} to {filters.endDate || "Any"}</strong></div>
              <div><span>Format</span><strong>{filters.format.toUpperCase()}</strong></div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default ExportOrdersCenter;
