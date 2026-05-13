const orders = [
  {
    id: "#VS-1048",
    customer: "Aarav Mehta",
    item: "Leather Tote",
    total: "₹15,699",
    status: "Processing",
  },
  {
    id: "#VS-1047",
    customer: "Maya Carter",
    item: "Luxe Jacket",
    total: "₹28,299",
    status: "Shipped",
  },
  {
    id: "#VS-1046",
    customer: "Nina Shah",
    item: "Gift Set",
    total: "₹10,299",
    status: "Pending",
  },
];

function OrdersSection() {
  return (
    <section className="orders-section">
      <div className="vendor-section-heading">
        <div>
          <p>Recent orders</p>
          <h2>Fulfillment queue</h2>
        </div>
        <button type="button">Open</button>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div>
              <span>{order.id}</span>
              <strong>{order.customer}</strong>
              <small>{order.item}</small>
            </div>
            <div>
              <strong>{order.total}</strong>
              <small>{order.status}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OrdersSection;
