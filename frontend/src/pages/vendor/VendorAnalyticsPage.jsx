const products = [
  ["Crimson Luxe Jacket", "Rs. 18.8L", "Best-selling"],
  ["Signature Leather Tote", "Rs. 14.2L", "High repeat rate"],
  ["Premium Gift Set", "Rs. 2.1L", "Least-selling"],
];

function VendorAnalyticsPage() {
  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Performance lab</p>
          <h1>Analytics</h1>
          <span>Read sales patterns, product rankings, monthly performance, and customer signals.</span>
        </div>
      </section>

      <section className="vendor-insights-grid">
        <div className="vendor-panel revenue-panel">
          <div className="vendor-section-heading"><div><p>Sales charts</p><h2>Monthly performance</h2></div><span>+19%</span></div>
          <div className="revenue-chart"><span style={{ height: "38%" }} /><span style={{ height: "63%" }} /><span style={{ height: "56%" }} /><span style={{ height: "82%" }} /><span style={{ height: "74%" }} /><span style={{ height: "95%" }} /></div>
        </div>
        <div className="vendor-panel">
          <div className="vendor-section-heading"><div><p>Customer insights</p><h2>Audience quality</h2></div><span>Premium</span></div>
          <ul className="vendor-metric-list">
            <li><span>Repeat buyers</span><strong>42%</strong></li>
            <li><span>Wishlist adds</span><strong>8,420</strong></li>
            <li><span>Cart recovery</span><strong>31%</strong></li>
          </ul>
        </div>
        <div className="vendor-panel">
          <div className="vendor-section-heading"><div><p>Product ranking</p><h2>Best and least sellers</h2></div></div>
          <ul className="vendor-metric-list">
            {products.map(([name, value, status]) => (
              <li key={name}><span>{name}<small>{status}</small></span><strong>{value}</strong></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default VendorAnalyticsPage;
