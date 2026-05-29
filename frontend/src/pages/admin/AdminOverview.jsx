import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityPanel from "./ActivityPanel";
import DashboardCard from "./DashboardCard";
import OrdersTable from "./OrdersTable";
import Button from "../../components/common/Button";
import { getAdminReport } from "../../services/reportService";
import { downloadAdminReportPdf } from "../../utils/reportPdf";

const formatCurrency = (value = 0) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState("");
  const [reportStatus, setReportStatus] = useState({ type: "", message: "" });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminReport()
      .then((report) => {
        if (!isMounted) return;

        setStats([
          {
            title: "Total Revenue",
            value: formatCurrency(report.summary?.totalRevenue),
            change: "Live",
            tone: "purple",
            note: "Across all tenant stores",
          },
          {
            title: "Total Orders",
            value: String(report.summary?.totalOrders || 0),
            change: "Live",
            tone: "blue",
            note: "Orders stored in MongoDB",
          },
          {
            title: "Total Vendors",
            value: String(report.summary?.totalVendors || 0),
            change: "Live",
            tone: "cyan",
            note: `${report.summary?.pendingVendorApprovals || 0} pending approvals`,
          },
          {
            title: "Total Customers",
            value: String(report.summary?.totalCustomers || 0),
            change: "Live",
            tone: "violet",
            note: "Registered customer accounts",
          },
          {
            title: "Total Products",
            value: String(report.summary?.totalProducts || 0),
            change: "Live",
            tone: "purple",
            note: `${report.summary?.activeProducts || 0} active products`,
          },
          {
            title: "Total Reviews",
            value: String(report.reviewsSummary?.totalReviews || 0),
            change: "Live",
            tone: "blue",
            note: `${report.reviewsSummary?.averageRating || 0} average rating`,
          },
          {
            title: "Payments",
            value: String(report.summary?.totalPayments || 0),
            change: "Live",
            tone: "cyan",
            note: "Payment records in MongoDB",
          },
          {
            title: "Notifications",
            value: String(report.summary?.unreadNotifications || 0),
            change: "Live",
            tone: "violet",
            note: "Unread notifications",
          },
        ]);

        setTopProducts(
          (report.topSellingProducts || []).map((product) => ({
                name: product.name,
                vendor: product.category || "V SHOP",
                sold: product.sold || product.stock || 0,
                revenue: formatCurrency(product.revenue || product.price || 0),
              }))
        );
        setVendors(
          (report.charts?.vendorHealth || []).map((vendor) => ({
            name: vendor.name,
            status: "Live",
            stores: vendor.orders || 0,
            score: `${vendor.rating || 0}/5`,
          }))
        );
        setError("");
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Using backup offline stats.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportStatus({ type: "", message: "" });

    try {
      const report = await getAdminReport();
      downloadAdminReportPdf(report);
      setReportStatus({ type: "success", message: "Report downloaded" });
    } catch (requestError) {
      setReportStatus({ type: "error", message: requestError.message || "Unable to generate report" });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero">
        <div>
          <p className="admin-eyebrow">V SHOP command center</p>
          <h1>Premium multi-tenant ecommerce admin dashboard.</h1>
          <p>
            Track revenue, approve vendors, monitor orders, and keep every store in your marketplace moving smoothly.
          </p>
          {error ? <small style={{ color: "orange", display: "block", marginTop: "8px" }}>{error}</small> : null}
        </div>

        <Button
          className="hero-action"
          disabled={isGeneratingReport}
          onClick={handleGenerateReport}
          text={isGeneratingReport ? "Generating report..." : "Generate Report"}
        />

        {reportStatus.message ? (
          <span className={`admin-action-status admin-action-status--${reportStatus.type}`}>
            {reportStatus.message}
          </span>
        ) : null}
      </section>

      <section className="stats-grid" aria-label="Marketplace statistics">
        {stats.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </section>

      <section className="analytics-grid" aria-label="Revenue analytics">
        <article className="glass-panel revenue-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Revenue analytics</p>
              <h2>Revenue trend</h2>
            </div>
            <span className="panel-pill">Last 30 days</span>
          </div>

          <div className="line-chart" aria-label="Revenue chart placeholder">
            <span /><span /><span /><span /><span /><span />
          </div>

          <div className="chart-labels">
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
        </article>

        <article className="glass-panel orders-growth-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Orders growth</p>
              <h2>Conversion lift</h2>
            </div>
            <span className="panel-pill panel-pill--blue">Live</span>
          </div>

          <div className="bar-chart" aria-label="Orders growth chart placeholder">
            {(stats.length ? stats.slice(0, 7).map((item) => Number(String(item.value).replace(/\D/g, "")) || 0) : [0]).map((value, index, values) => {
              const maxValue = Math.max(...values, 1);
              const height = Math.max(12, Math.round((value / maxValue) * 100));
              return (
              <span key={height + index} style={{ "--bar-height": `${height}%` }} />
            );
            })}
          </div>
        </article>
      </section>

      <section className="dashboard-bento">
        <OrdersTable />
        <ActivityPanel />
      </section>

      <section className="management-grid">
        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Product management</p>
              <h2>Top selling products</h2>
            </div>
            <Button className="text-button" text="View all" onClick={() => navigate("/admin/products")} />
          </div>

          <div className="product-list">
            {topProducts.map((product) => (
              <div className="product-row" key={product.name}>
                <div className="product-thumb">{product.name.slice(0, 2)}</div>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.vendor}</p>
                </div>
                <div className="product-meta">
                  <strong>{product.revenue}</strong>
                  <span>{product.sold} sold</span>
                </div>
              </div>
            ))}
            {topProducts.length === 0 ? <div className="notification-state">No product sales yet.</div> : null}
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Vendor management</p>
              <h2>Store health</h2>
            </div>
            <Button className="text-button" text="Approve" onClick={() => navigate("/admin/vendor-approvals")} />
          </div>

          <div className="vendor-list">
            {vendors.map((vendor) => (
              <div className="vendor-row" key={vendor.name}>
                <div>
                  <h3>{vendor.name}</h3>
                  <p>{vendor.stores} stores connected</p>
                </div>
                <span className={`status-badge status-badge--${vendor.status.toLowerCase()}`}>
                  {vendor.status}
                </span>
                <strong>{vendor.score}</strong>
              </div>
            ))}
            {vendors.length === 0 ? <div className="notification-state">No vendor activity yet.</div> : null}
          </div>
        </article>
      </section>
    </div>
  );
}

export default AdminOverview;
