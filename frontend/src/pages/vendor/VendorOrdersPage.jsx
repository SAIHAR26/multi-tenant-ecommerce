import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getVendorOrders } from "../../services/vendorService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;
const getOrderItems = (order) =>
  order.products?.map((item) => item.productId?.name || item.name || "Product").join(", ") || "Order items";

function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = () => {
    setLoading(true);
    setError("");

    return getVendorOrders()
      .then((data) => {
        const ordersArray = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        setOrders(ordersArray);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Orders could not be loaded.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;

    getVendorOrders()
      .then((data) => {
        const ordersArray = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        if (isMounted) {
          setOrders(ordersArray);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Orders could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const packed = orders.filter((order) => order.status === "PACKED").length;
    const inTransit = orders.filter((order) => order.status === "SHIPPED").length;
    const delivered = orders.filter((order) => order.status === "DELIVERED").length;

    return {
      newOrders: orders.length,
      packed,
      inTransit,
      delivered,
    };
  }, [orders]);

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
        <article className="vendor-stat-card"><div className="vendor-stat-icon">NW</div><div><p>New Orders</p><strong>{stats.newOrders}</strong><span>Live total</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">PK</div><div><p>Packed</p><strong>{stats.packed}</strong><span>Ready to ship</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">TR</div><div><p>In Transit</p><strong>{stats.inTransit}</strong><span>Live tracking</span></div></article>
        <article className="vendor-stat-card"><div className="vendor-stat-icon">DL</div><div><p>Delivered</p><strong>{stats.delivered}</strong><span>Completed</span></div></article>
      </section>

      <section className="orders-section vendor-full-panel">
        <div className="vendor-section-heading">
          <div>
            <p>Recent orders</p>
            <h2>Order tracking</h2>
          </div>
          <button type="button" onClick={loadOrders} disabled={loading}>
            {loading ? "Syncing..." : "Sync courier"}
          </button>
        </div>

        {loading ? <LoadingState message="Loading orders..." /> : null}
        {!loading && error ? <ErrorState title="Unable to load orders" message={error} /> : null}
        {!loading && !error && orders.length === 0 ? <ErrorState title="No orders" message="No fulfillment records found." /> : null}

        {!loading && !error && orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order._id || order.id}>
                <div>
                  <span>#{String(order._id || order.id).slice(-6).toUpperCase()}</span>
                  <strong>{order.userId?.name || order.customer || "Customer"}</strong>
                  <small>{getOrderItems(order)} - ETA live</small>
                </div>
                <div>
                  <strong>{formatPrice(order.totalAmount)}</strong>
                  <small>{order.status}</small>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}

export default VendorOrdersPage;
