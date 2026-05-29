import { useEffect, useMemo, useState } from "react";
import { getAdminReport } from "../../services/reportService";
import { downloadAdminReportPdf } from "../../utils/reportPdf";

const formatCurrency = (value = 0) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

function AnalyticsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAdminReport()
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Analytics could not be loaded.");
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

  const summary = report?.summary || {};
  const reviewsSummary = report?.reviewsSummary || {};
  const topProducts = useMemo(() => report?.topSellingProducts || [], [report]);

  const chartHeights = useMemo(() => {
    const maxRevenue = Math.max(...topProducts.map((product) => Number(product.revenue || 0)), 1);

    return topProducts.length
      ? topProducts.map((product) => Math.max(16, Math.round((Number(product.revenue || 0) / maxRevenue) * 100)))
      : [24, 32, 28, 40, 36];
  }, [topProducts]);

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Analytics</p>
          <h1>Marketplace performance intelligence.</h1>
          <p>Visualize revenue, order flow, catalog performance, and review health from live marketplace data.</p>
        </div>
        <button
          className="hero-action"
          type="button"
          disabled={!report}
          onClick={() => downloadAdminReportPdf(report)}
        >
          Download Report
        </button>
      </section>

      {loading ? <div className="notification-state">Loading analytics...</div> : null}
      {error ? <p className="admin-action-status admin-action-status--error">{error}</p> : null}

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Revenue</span><strong>Live</strong></div><h2>{formatCurrency(summary.totalRevenue)}</h2><p>Gross marketplace revenue</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Orders</span><strong>MongoDB</strong></div><h2>{summary.totalOrders || 0}</h2><p>Total orders recorded</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>Customers</span><strong>Accounts</strong></div><h2>{summary.totalCustomers || 0}</h2><p>Registered shoppers</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>Avg Rating</span><strong>Reviews</strong></div><h2>{reviewsSummary.averageRating || 0}</h2><p>{reviewsSummary.totalReviews || 0} reviews tracked</p></article>
      </section>

      <section className="analytics-grid">
        <article className="glass-panel revenue-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Revenue charts</p><h2>Top product revenue</h2></div><span className="panel-pill">Live report</span></div>
          <div className="bar-chart" aria-label="Top product revenue chart">
            {chartHeights.map((height, index) => (
              <span key={`${height}-${index}`} style={{ "--bar-height": `${height}%` }} />
            ))}
          </div>
          <div className="chart-labels">
            {(topProducts.length ? topProducts : [{ name: "No data" }]).slice(0, 4).map((product) => (
              <span key={product.name}>{product.name}</span>
            ))}
          </div>
        </article>
        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Growth</p><h2>Marketplace mix</h2></div><span className="panel-pill panel-pill--blue">{summary.pendingVendorApprovals || 0} pending</span></div>
          <div className="bar-chart" aria-label="Marketplace mix chart">
            {[summary.totalVendors, summary.totalCustomers, summary.totalOrders, reviewsSummary.totalReviews].map((value, index) => {
              const maxValue = Math.max(summary.totalVendors || 0, summary.totalCustomers || 0, summary.totalOrders || 0, reviewsSummary.totalReviews || 0, 1);
              return <span key={`${value}-${index}`} style={{ "--bar-height": `${Math.max(12, Math.round((Number(value || 0) / maxValue) * 100))}%` }} />;
            })}
          </div>
        </article>
      </section>
    </div>
  );
}

export default AnalyticsPage;
