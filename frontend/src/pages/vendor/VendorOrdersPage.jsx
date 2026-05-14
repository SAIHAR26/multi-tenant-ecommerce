const orders = [
  { id: "#VS-1048", customer: "Aarav Mehta", item: "Leather Tote", total: "Rs. 15,699", status: "Processing", location: "Mumbai", eta: "Today, 7 PM" },
  { id: "#VS-1047", customer: "Maya Carter", item: "Luxe Jacket", total: "Rs. 28,299", status: "Shipped", location: "Bengaluru", eta: "Tomorrow" },
  { id: "#VS-1046", customer: "Nina Shah", item: "Gift Set", total: "Rs. 10,299", status: "Pending", location: "Delhi", eta: "Awaiting pickup" },
];

function VendorOrdersPage() {
  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Fulfillment center</p>
          <h1>Orders</h1>
          <span>Track customers, delivery movement, and priority fulfillment.</span>
        </div>
      </section>

      <section className="vendor-stats-grid" aria-label="Order statistics">
        <article className="vendor-stat-card"><div className="vendor-stat-icon">NW</div><div><p>New Orders</p><strong>96</strong><span>Today</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">PK</div><div><p>Packed</p><strong>64</strong><span>Ready to ship</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">TR</div><div><p>In Transit</p><strong>211</strong><span>Live tracking</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">DL</div><div><p>Delivered</p><strong>1,115</strong><span>This month</span></div></article>
      </section>

      <section className="orders-section vendor-full-panel">
        <div className="vendor-section-heading">
          <div>
            <p>Recent orders</p>
            <h2>Order tracking</h2>
          </div>
          <button type="button">Sync courier</button>
        </div>
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <span>{order.id} - {order.location}</span>
                <strong>{order.customer}</strong>
                <small>{order.item} - ETA {order.eta}</small>
              </div>
              <div>
                <strong>{order.total}</strong>
                <small>{order.status}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default VendorOrdersPage;
