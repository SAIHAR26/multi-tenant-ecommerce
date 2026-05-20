import { useEffect, useState } from "react";
import ActivityPanel from "./ActivityPanel";
import DashboardCard from "./DashboardCard";
import OrdersTable from "./OrdersTable";
import Button from "../../components/common/Button";

// Dynamic platform endpoint mapping
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminOverview() {
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchAdminDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/admin/overview`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Marketplace engine returned an invalid status flag.");
        }

        const data = await response.json();

        if (isMounted) {
          setStats(data.stats || []);
          setTopProducts(data.topProducts || []);
          setVendors(data.vendors || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          // Robust fallbacks matching original design specifications to guarantee no crashes
          setStats([
            { title: "Total Revenue", value: "₹1.28Cr", change: "+18.4%", tone: "purple", note: "Across all tenant stores" },
            { title: "Total Orders", value: "8,492", change: "+12.7%", tone: "blue", note: "1,204 orders this week" },
            { title: "Total Vendors", value: "342", change: "+9.1%", tone: "cyan", note: "28 pending approvals" },
            { title: "Total Customers", value: "64.8K", change: "+24.2%", tone: "violet", note: "High retention segment" }
          ]);
          setTopProducts([
            { name: "Noir Leather Tote", vendor: "Luxe Lane", sold: 842, revenue: "₹24.8L" },
            { name: "Urban Runner Pro", vendor: "Redline Studio", sold: 719, revenue: "₹18.6L" },
            { name: "Matte Utility Jacket", vendor: "Urban Vault", sold: 604, revenue: "₹16.2L" }
          ]);
          setVendors([
            { name: "Urban Vault", status: "Live", stores: 4, score: "98%" },
            { name: "Luxe Lane", status: "Review", stores: 2, score: "92%" },
            { name: "Redline Studio", status: "Live", stores: 3, score: "96%" }
          ]);
          setError("Using backup offline stats: " + (err.message || ""));
          setLoading(false);
        }
      }
    }

    fetchAdminDashboardData();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="admin-page" style={{ padding: "40px", color: "#fff" }}>
        <p className="admin-eyebrow">Syncing marketplace state tables across active cluster channels...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div>
          <p className="admin-eyebrow">V SHOP command center</p>
          <h1>Premium multi-tenant ecommerce admin dashboard.</h1>
          <p>
            Track revenue, approve vendors, monitor orders, and keep every
            store in your marketplace moving smoothly.
          </p>
          {error && <small style={{ color: "orange", display: "block", marginTop: "8px" }}>{error}</small>}
        </div>

        <Button className="hero-action" text="Generate Report" />
      </section>

      {/* Statistics */}
      <section className="stats-grid" aria-label="Marketplace statistics">
        {stats.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </section>

      {/* Analytics */}
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
            <span className="panel-pill panel-pill--blue">+14.8%</span>
          </div>

          <div className="bar-chart" aria-label="Orders growth chart placeholder">
            {[45, 62, 52, 74, 68, 88, 78].map((height, index) => (
              <span key={height + index} style={{ "--bar-height": `${height}%` }} />
            ))}
          </div>
        </article>
      </section>

      {/* Tables and Activity Bento */}
      <section className="dashboard-bento">
        <OrdersTable />
        <ActivityPanel />
      </section>

      {/* Management Section */}
      <section className="management-grid">
        {/* Products Management */}
        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Product management</p>
              <h2>Top selling products</h2>
            </div>
            <Button className="text-button" text="View all" />
          </div>

          <div className="product-list">
            {topProducts.length === 0 ? (
              <p style={{ opacity: 0.6, fontSize: "14px", padding: "10px" }}>No product metrics found.</p>
            ) : (
              topProducts.map((product) => (
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
              ))
            )}
          </div>
        </article>

        {/* Vendors Management */}
        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Vendor management</p>
              <h2>Store health</h2>
            </div>
            <Button className="text-button" text="Approve" />
          </div>

          <div className="vendor-list">
            {vendors.length === 0 ? (
              <p style={{ opacity: 0.6, fontSize: "14px", padding: "10px" }}>No active platform vendors linked.</p>
            ) : (
              vendors.map((vendor) => (
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
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

export default AdminOverview;