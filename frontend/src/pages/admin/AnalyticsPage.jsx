function AnalyticsPage() {
  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Analytics</p>
          <h1>Marketplace performance intelligence.</h1>
          <p>Visualize revenue, conversion growth, vendor contribution, and customer demand trends.</p>
        </div>
        <button className="hero-action" type="button">Download Report</button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Revenue</span><strong>+18.4%</strong></div><h2>₹1.28Cr</h2><p>Current month total</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Conversion</span><strong>+14.8%</strong></div><h2>6.8%</h2><p>Across storefront traffic</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>GMV Growth</span><strong>Strong</strong></div><h2>22%</h2><p>Quarter over quarter</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>Refund Rate</span><strong>Low</strong></div><h2>1.8%</h2><p>Below marketplace target</p></article>
      </section>

      <section className="analytics-grid">
        <article className="glass-panel revenue-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Revenue charts</p><h2>GMV trend</h2></div><span className="panel-pill">Last 12 weeks</span></div>
          <div className="line-chart" aria-label="Revenue chart placeholder"><span /><span /><span /><span /><span /><span /></div>
          <div className="chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span></div>
        </article>
        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Growth</p><h2>Order velocity</h2></div><span className="panel-pill panel-pill--blue">+14.8%</span></div>
          <div className="bar-chart" aria-label="Growth chart placeholder">
            {[42, 58, 66, 72, 64, 82, 91].map((height, index) => (
              <span key={height + index} style={{ "--bar-height": `${height}%` }} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default AnalyticsPage;
