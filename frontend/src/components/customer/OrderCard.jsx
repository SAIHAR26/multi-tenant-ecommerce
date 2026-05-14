function OrderCard({ order }) {
  return (
    <article className="customer-order-card">
      <img src={order.image} alt={order.product} />

      <div>
        <p className="customer-eyebrow">{order.status}</p>
        <h3>{order.product}</h3>
        <span>{order.vendor}</span>
      </div>

      <div className="customer-order-card__side">
        <strong>{order.delivery}</strong>
        <button className="customer-secondary-button" type="button">Track Order</button>
      </div>
    </article>
  );
}

export default OrderCard;
