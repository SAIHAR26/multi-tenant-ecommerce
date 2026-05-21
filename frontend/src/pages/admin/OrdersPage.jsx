import OrdersTable from "./OrdersTable";
import { useNavigate } from "react-router-dom";

const transactions = [
  { id: "TXN-9812", method: "UPI", status: "Paid", amount: "₹20,584" },
  { id: "TXN-9811", method: "Card", status: "Paid", amount: "₹15,687" },
  { id: "TXN-9810", method: "Net Banking", status: "Pending", amount: "₹26,892" },
];

function OrdersPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Order operations</p>
          <h1>Monitor every marketplace order.</h1>
          <p>Review order flow, fulfillment status, and recent transaction activity in one place.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/export-orders")}>
          Export Orders
        </button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Total Orders</span><strong>+12.7%</strong></div><h2>8,492</h2><p>1,204 orders this week</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Fulfilled</span><strong>On time</strong></div><h2>7,846</h2><p>92.4% fulfillment rate</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>Pending</span><strong>Watch</strong></div><h2>318</h2><p>Awaiting vendor action</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>Order Value</span><strong>+8.8%</strong></div><h2>₹4,820</h2><p>Average basket value</p></article>
      </section>

      <section className="dashboard-bento">
        <OrdersTable />
        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Transactions</p><h2>Recent payments</h2></div></div>
          <div className="activity-list">
            {transactions.map((transaction) => (
              <div className="activity-item" key={transaction.id}>
                <span className="activity-dot" />
                <div><h3>{transaction.id}</h3><p>{transaction.method} payment marked {transaction.status.toLowerCase()}.</p><time>{transaction.amount}</time></div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default OrdersPage;
