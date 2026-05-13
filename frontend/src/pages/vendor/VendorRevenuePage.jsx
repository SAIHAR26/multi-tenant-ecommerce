function VendorRevenuePage() {
  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Revenue intelligence</p>
          <h1>Revenue</h1>
          <span>Understand payouts, monthly income, sales lift, and growth quality.</span>
        </div>
      </section>

      <section className="vendor-stats-grid" aria-label="Revenue statistics">
        <article className="vendor-stat-card"><div className="vendor-stat-icon">GM</div><div><p>Gross Sales</p><strong>Rs. 70.2L</strong><span>+12.8%</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">PT</div><div><p>Payout Ready</p><strong>Rs. 18.4L</strong><span>Friday cycle</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">AV</div><div><p>Avg Order</p><strong>Rs. 6,420</strong><span>+8.1%</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">GR</div><div><p>Growth</p><strong>24.2%</strong><span>Month over month</span></div></article>
      </section>

      <section className="vendor-insights-grid">
        <div className="vendor-panel revenue-panel">
          <div className="vendor-section-heading"><div><p>Monthly income</p><h2>Income chart</h2></div><span>2026</span></div>
          <div className="revenue-chart"><span style={{ height: "46%" }} /><span style={{ height: "52%" }} /><span style={{ height: "69%" }} /><span style={{ height: "61%" }} /><span style={{ height: "88%" }} /><span style={{ height: "93%" }} /></div>
        </div>
        <div className="vendor-panel growth-panel">
          <div className="vendor-section-heading"><div><p>Sales analytics</p><h2>Growth statistics</h2></div><span>Healthy</span></div>
          <div className="growth-chart"><div className="growth-line" /><div className="growth-dot growth-dot-one" /><div className="growth-dot growth-dot-two" /><div className="growth-dot growth-dot-three" /></div>
        </div>
      </section>
    </>
  );
}

export default VendorRevenuePage;
