import { useEffect, useMemo, useState } from "react";
import { exportOrders, getOrders } from "../../services/orderService";

const formatCurrency = (value = 0) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const normalizePaymentStatus = (status = "PENDING") => {
  const normalized = String(status).toUpperCase();
  if (normalized === "SUCCESS" || normalized === "PAID") return "Paid";
  if (normalized === "FAILED") return "Failed";
  return "Pending";
};

function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    getOrders()
      .then((data) => {
        if (isMounted) {
          setOrders(Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : []);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Payments could not be loaded.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);
    const paid = orders.filter((order) => normalizePaymentStatus(order.paymentStatus) === "Paid");
    const pending = orders.filter((order) => normalizePaymentStatus(order.paymentStatus) === "Pending");
    const failed = orders.filter((order) => normalizePaymentStatus(order.paymentStatus) === "Failed");
    const successRate = orders.length ? Math.round((paid.length / orders.length) * 1000) / 10 : 0;

    return { revenue, paid, pending, failed, successRate };
  }, [orders]);

  const handleExport = async () => {
    setGenerating(true);
    setError("");
    setMessage("");

    try {
      const { blob, fileName } = await exportOrders({ format: "csv", status: "all" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Payment export downloaded.");
    } catch (exportError) {
      setError(exportError.message || "Payment export could not be generated.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Payments</p>
          <h1>Control marketplace money movement.</h1>
          <p>Monitor revenue, payment health, and payout readiness from order payment data.</p>
        </div>
        <button className="hero-action" type="button" disabled={generating} onClick={handleExport}>
          {generating ? "Exporting..." : "Export Payments"}
        </button>
      </section>

      {(message || error) ? (
        <p className={`admin-action-status ${error ? "admin-action-status--error" : "admin-action-status--success"}`}>
          {error || message}
        </p>
      ) : null}

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Revenue</span><strong>Orders</strong></div><h2>{formatCurrency(stats.revenue)}</h2><p>Gross marketplace revenue</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Paid</span><strong>Cleared</strong></div><h2>{stats.paid.length}</h2><p>Successful payment orders</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>Pending</span><strong>Review</strong></div><h2>{stats.pending.length}</h2><p>Awaiting payment confirmation</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>Success Rate</span><strong>Live</strong></div><h2>{stats.successRate}%</h2><p>{stats.failed.length} failed payments</p></article>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Payment history</p><h2>Recent transactions</h2></div><button className="text-button" type="button" disabled={generating} onClick={handleExport}>Export</button></div>
          {loading ? <div className="notification-state">Loading payments...</div> : null}
          {!loading && !error && orders.length === 0 ? <div className="notification-state">No payments found</div> : null}
          {!loading && orders.length > 0 ? (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead><tr><th>Payment ID</th><th>Customer</th><th>Method</th><th>Status</th><th>Amount</th></tr></thead>
                <tbody>
                  {orders.slice(0, 8).map((order) => {
                    const status = normalizePaymentStatus(order.paymentStatus);

                    return (
                      <tr key={order._id || order.id}>
                        <td>PAY-{String(order._id || order.id).slice(-6).toUpperCase()}</td>
                        <td>{order.userId?.name || order.customer || "Customer"}</td>
                        <td>{order.paymentMethod || "Order payment"}</td>
                        <td><span className={`status-badge status-badge--${status.toLowerCase()}`}>{status}</span></td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Revenue stats</p><h2>Settlement mix</h2></div></div>
          <div className="bar-chart" aria-label="Payment analytics chart">
            {[stats.paid.length, stats.pending.length, stats.failed.length, orders.length].map((value, index) => {
              const maxValue = Math.max(orders.length, 1);
              return <span key={`${value}-${index}`} style={{ "--bar-height": `${Math.max(12, Math.round((Number(value || 0) / maxValue) * 100))}%` }} />;
            })}
          </div>
        </article>
      </section>
    </div>
  );
}

export default PaymentsPage;
