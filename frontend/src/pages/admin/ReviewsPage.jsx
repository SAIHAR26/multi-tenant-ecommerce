const reviews = [
  { product: "Noir Leather Tote", customer: "Anaya Rao", rating: "5.0", status: "Live" },
  { product: "Urban Runner Pro", customer: "Rohan Mehta", rating: "4.8", status: "Live" },
  { product: "Matte Utility Jacket", customer: "Maya Sen", rating: "4.4", status: "Review" },
  { product: "Chrome Wallet", customer: "Neil Kapoor", rating: "4.6", status: "Pending" },
];

function ReviewsPage() {
  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Reviews</p>
          <h1>Moderate product trust signals.</h1>
          <p>Track customer feedback, review quality, and marketplace reputation across vendors.</p>
        </div>
        <button className="hero-action" type="button">Moderate Reviews</button>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Review queue</p><h2>Recent reviews</h2></div><span className="panel-pill">4.8 avg</span></div>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Status</th></tr></thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.product}>
                    <td>{review.product}</td><td>{review.customer}</td><td>{review.rating}</td>
                    <td><span className={`status-badge status-badge--${review.status.toLowerCase()}`}>{review.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Sentiment</p><h2>Trust health</h2></div></div>
          <div className="activity-list">
            <div className="activity-item"><span className="activity-dot" /><div><h3>Positive mentions</h3><p>Customers praise packaging and fast delivery.</p><time>82%</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Needs review</h3><p>6 reviews flagged for moderation.</p><time>Today</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Vendor response</h3><p>Average response time under 3 hours.</p><time>Good</time></div></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ReviewsPage;
