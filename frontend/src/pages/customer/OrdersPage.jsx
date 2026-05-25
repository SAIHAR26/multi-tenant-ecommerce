import { useEffect, useState } from "react";
import OrderCard from "../../components/customer/OrderCard";
import { downloadInvoice, getOrders } from "../../services/orderService";
import { formatPrice } from "../../utils/orderTotals";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        const ordersArray = Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data)
          ? data
          : [];

        setOrders(ordersArray);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === "DELIVERED").length;
  const inTransitOrders = orders.filter((order) => ["PROCESSING", "PACKED", "SHIPPED"].includes(order.status)).length;
  const totalSpent = orders.reduce((total, order) => total + (Number(order.totalAmount) || 0), 0);

  const handleDownloadInvoice = () => {
    if (!orders.length) return;
    downloadInvoice(orders[0]);
  };

  if (loading) {
    return (
      <div className="customer-page">
        <h2>Loading orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Order history</p>
          <h1>Every order, beautifully organized.</h1>
          <p>Review recent purchases, delivery estimates, invoices, and order statuses from V SHOP vendors.</p>
        </div>

        <button
          className="customer-primary-button"
          type="button"
          disabled={!orders.length}
          onClick={handleDownloadInvoice}
        >
          Download Invoice
        </button>
      </section>

      <section className="customer-stats-grid">
        <article className="customer-stat-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
          <p>All-time purchases</p>
        </article>

        <article className="customer-stat-card">
          <span>In Transit</span>
          <h2>{inTransitOrders}</h2>
          <p>Arriving this week</p>
        </article>

        <article className="customer-stat-card">
          <span>Delivered</span>
          <h2>{deliveredOrders}</h2>
          <p>Completed orders</p>
        </article>

        <article className="customer-stat-card">
          <span>Total Spent</span>
          <h2>{formatPrice(totalSpent)}</h2>
          <p>Across premium vendors</p>
        </article>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">Recent orders</p>
            <h2>Purchase timeline</h2>
          </div>
        </div>

        <div className="customer-order-list">
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard order={order} key={order._id || order.id} />)
          ) : (
            <div className="empty-browse-state">
              <h2>No orders found</h2>
              <p>You have not placed any orders yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default OrdersPage;
