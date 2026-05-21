import { useNavigate } from "react-router-dom";

const customers = [
  { name: "Anaya Rao", segment: "VIP", orders: 18, value: "₹2.4L", status: "Live" },
  { name: "Rohan Mehta", segment: "Repeat", orders: 11, value: "₹98K", status: "Live" },
  { name: "Maya Sen", segment: "New", orders: 2, value: "₹26K", status: "Review" },
  { name: "Neil Kapoor", segment: "Repeat", orders: 9, value: "₹72K", status: "Live" },
];

function CustomersPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Customer intelligence</p>
          <h1>Understand premium shoppers.</h1>
          <p>Track segments, purchase value, retention signals, and high-intent customer activity.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/customer-segments")}>
          Create Segment
        </button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Total Customers</span><strong>+24.2%</strong></div><h2>64.8K</h2><p>Across all stores</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Repeat Buyers</span><strong>+12.4%</strong></div><h2>18.2K</h2><p>Purchased more than once</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>VIP Customers</span><strong>High</strong></div><h2>2,148</h2><p>Premium value segment</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>Avg Order Value</span><strong>+8.6%</strong></div><h2>₹4,820</h2><p>Marketplace blended average</p></article>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div><p className="admin-eyebrow">Customers</p><h2>Recent customer activity</h2></div>
            <input className="panel-search" type="search" placeholder="Search customers..." />
          </div>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead><tr><th>Customer</th><th>Segment</th><th>Orders</th><th>Value</th><th>Status</th></tr></thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.name}>
                    <td>{customer.name}</td><td>{customer.segment}</td><td>{customer.orders}</td><td>{customer.value}</td>
                    <td><span className={`status-badge status-badge--${customer.status.toLowerCase()}`}>{customer.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Retention</p><h2>Customer signals</h2></div></div>
          <div className="bar-chart" aria-label="Customer retention chart placeholder">
            {[52, 68, 61, 74, 82, 77, 89].map((height, index) => (
              <span key={height + index} style={{ "--bar-height": `${height}%` }} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default CustomersPage;
