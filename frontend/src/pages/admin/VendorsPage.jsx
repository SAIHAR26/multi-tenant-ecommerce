import { useNavigate } from "react-router-dom";

const vendors = [
  { name: "Urban Vault", owner: "Arjun Rao", status: "Live", products: 128, revenue: "₹18.4L" },
  { name: "Luxe Lane", owner: "Meera Shah", status: "Review", products: 76, revenue: "₹12.9L" },
  { name: "Redline Studio", owner: "Kabir Sen", status: "Live", products: 94, revenue: "₹15.6L" },
  { name: "Chrome House", owner: "Nisha Kapoor", status: "Pending", products: 38, revenue: "₹4.2L" },
];

function VendorsPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Vendor management</p>
          <h1>Manage marketplace vendors.</h1>
          <p>Review onboarding, monitor store health, and keep premium sellers ready for customers.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/vendor-approvals")}>
          Approve Vendor
        </button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple">
          <div className="dashboard-card__top"><span>Active Vendors</span><strong>+9.1%</strong></div>
          <h2>342</h2>
          <p>Live across all tenant stores</p>
        </article>
        <article className="dashboard-card dashboard-card--blue">
          <div className="dashboard-card__top"><span>Pending Review</span><strong>28</strong></div>
          <h2>₹8.6L</h2>
          <p>Projected monthly value</p>
        </article>
        <article className="dashboard-card dashboard-card--cyan">
          <div className="dashboard-card__top"><span>Avg Store Score</span><strong>Stable</strong></div>
          <h2>96%</h2>
          <p>Quality and fulfillment score</p>
        </article>
        <article className="dashboard-card dashboard-card--violet">
          <div className="dashboard-card__top"><span>New Requests</span><strong>Today</strong></div>
          <h2>14</h2>
          <p>Awaiting document checks</p>
        </article>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Vendor directory</p>
              <h2>Store approval pipeline</h2>
            </div>
            <input className="panel-search" type="search" placeholder="Search vendors..." />
          </div>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr><th>Vendor</th><th>Owner</th><th>Status</th><th>Products</th><th>Revenue</th></tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.name}>
                    <td>{vendor.name}</td>
                    <td>{vendor.owner}</td>
                    <td><span className={`status-badge status-badge--${vendor.status.toLowerCase()}`}>{vendor.status}</span></td>
                    <td>{vendor.products}</td>
                    <td>{vendor.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Approvals</p>
              <h2>Verification focus</h2>
            </div>
          </div>
          <div className="activity-list">
            <div className="activity-item"><span className="activity-dot" /><div><h3>KYC checks</h3><p>8 vendors need GST and identity validation.</p><time>Priority</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Catalog quality</h3><p>12 stores have products waiting for review.</p><time>Today</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Fulfillment risk</h3><p>2 vendors dropped below shipping SLA.</p><time>Watchlist</time></div></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default VendorsPage;
