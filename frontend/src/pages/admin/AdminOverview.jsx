import ActivityPanel from "./ActivityPanel";
import DashboardCard from "./DashboardCard";
import OrdersTable from "./OrdersTable";

const stats = [
  {
    title: "Total Revenue",
    value: "₹1.28Cr",
    change: "+18.4%",
    tone: "purple",
    note: "Across all tenant stores",
  },
  {
    title: "Total Orders",
    value: "8,492",
    change: "+12.7%",
    tone: "blue",
    note: "1,204 orders this week",
  },
  {
    title: "Total Vendors",
    value: "342",
    change: "+9.1%",
    tone: "cyan",
    note: "28 pending approvals",
  },
  {
    title: "Total Customers",
    value: "64.8K",
    change: "+24.2%",
    tone: "violet",
    note: "High retention segment",
  },
];

const topProducts = [
  { name: "Noir Leather Tote", vendor: "Luxe Lane", sold: 842, revenue: "₹24.8L" },
  { name: "Urban Runner Pro", vendor: "Redline Studio", sold: 719, revenue: "₹18.6L" },
  { name: "Matte Utility Jacket", vendor: "Urban Vault", sold: 604, revenue: "₹16.2L" },
];

const vendors = [
  { name: "Urban Vault", status: "Live", stores: 4, score: "98%" },
  { name: "Luxe Lane", status: "Review", stores: 2, score: "92%" },
  { name: "Redline Studio", status: "Live", stores: 3, score: "96%" },
];

function AdminOverview() {
  return (
    <div className="admin-page">
      {/* Page hero: quick context and primary admin action. */}
      <section className="dashboard-hero">
        <div>
          <p className="admin-eyebrow">V SHOP command center</p>
          <h1>Premium multi-tenant ecommerce admin dashboard.</h1>
          <p>
            Track revenue, approve vendors, monitor orders, and keep every
            store in your marketplace moving smoothly.
          </p>
        </div>
        <button className="hero-action" type="button">
          Generate Report
        </button>
      </section>

      {/* Statistics cards summarize the most important SaaS metrics. */}
      <section className="stats-grid" aria-label="Marketplace statistics">
        {stats.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </section>

      {/* Analytics cards use lightweight chart placeholders for future data wiring. */}
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
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="chart-labels">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
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

      <section className="dashboard-bento">
        <OrdersTable />
        <ActivityPanel />
      </section>

      <section className="management-grid">
        {/* Product management preview for best sellers and inventory focus. */}
        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Product management</p>
              <h2>Top selling products</h2>
            </div>
            <button className="text-button" type="button">View all</button>
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
          </div>
        </article>

        {/* Vendor management preview highlights onboarding health. */}
        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Vendor management</p>
              <h2>Store health</h2>
            </div>
            <button className="text-button" type="button">Approve</button>
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
          </div>
        </article>
      </section>
    </div>
  );
}

export default AdminOverview;
