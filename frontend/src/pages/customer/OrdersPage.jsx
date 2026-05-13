import OrderCard from "../../components/customer/OrderCard";
import { orders } from "./customerData";

function OrdersPage() {
  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Order history</p>
          <h1>Every order, beautifully organized.</h1>
          <p>Review recent purchases, delivery estimates, invoices, and order statuses from V SHOP vendors.</p>
        </div>
        <button className="customer-primary-button" type="button">Download Invoice</button>
      </section>

      <section className="customer-stats-grid">
        <article className="customer-stat-card"><span>Total Orders</span><h2>18</h2><p>All-time purchases</p></article>
        <article className="customer-stat-card"><span>In Transit</span><h2>3</h2><p>Arriving this week</p></article>
        <article className="customer-stat-card"><span>Delivered</span><h2>15</h2><p>Completed orders</p></article>
        <article className="customer-stat-card"><span>Total Spent</span><h2>₹2.8L</h2><p>Across premium vendors</p></article>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div><p className="customer-eyebrow">Recent orders</p><h2>Purchase timeline</h2></div>
        </div>
        <div className="customer-order-list">
          {orders.map((order) => (
            <OrderCard order={order} key={order.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default OrdersPage;
