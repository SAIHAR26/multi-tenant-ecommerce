const payments = [
  { id: "PAY-4821", vendor: "Luxe Lane", method: "UPI", status: "Paid", amount: "₹2,48,000" },
  { id: "PAY-4820", vendor: "Redline Studio", method: "Card", status: "Paid", amount: "₹1,86,000" },
  { id: "PAY-4819", vendor: "Urban Vault", method: "Net Banking", status: "Pending", amount: "₹1,62,000" },
  { id: "PAY-4818", vendor: "Chrome House", method: "UPI", status: "Review", amount: "₹78,000" },
];

function PaymentsPage() {
  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Payments</p>
          <h1>Control marketplace money movement.</h1>
          <p>Monitor revenue, settlements, payment health, and vendor payout activity.</p>
        </div>
        <button className="hero-action" type="button">Settle Payouts</button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Revenue</span><strong>+18.4%</strong></div><h2>₹1.28Cr</h2><p>Gross marketplace revenue</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Settled</span><strong>Today</strong></div><h2>₹42.6L</h2><p>Vendor payouts cleared</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>Pending</span><strong>Review</strong></div><h2>₹8.4L</h2><p>Held for verification</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>Success Rate</span><strong>Stable</strong></div><h2>98.7%</h2><p>Payment gateway health</p></article>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Payment history</p><h2>Recent transactions</h2></div><button className="text-button" type="button">Export</button></div>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead><tr><th>Payment ID</th><th>Vendor</th><th>Method</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td><td>{payment.vendor}</td><td>{payment.method}</td>
                    <td><span className={`status-badge status-badge--${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                    <td>{payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Revenue stats</p><h2>Settlement mix</h2></div></div>
          <div className="bar-chart" aria-label="Payment analytics chart placeholder">
            {[66, 72, 58, 81, 76, 88, 69].map((height, index) => (
              <span key={height + index} style={{ "--bar-height": `${height}%` }} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default PaymentsPage;
