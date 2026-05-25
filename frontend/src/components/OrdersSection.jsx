import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import { getOrders } from "../services/orderService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;
const getOrderItems = (order) =>
  order.products?.map((item) => item.productId?.name || item.name || "Product").join(", ") || "Order items";

function OrdersSection() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getOrders()
      .then((data) => {
        const ordersArray = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        if (isMounted) {
          setOrders(ordersArray.slice(0, 4));
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

  return (
    <section className="orders-section">
      <div className="vendor-section-heading">
        <div>
          <p>Recent orders</p>
          <h2>Fulfillment queue</h2>
        </div>
        <button type="button" onClick={() => navigate("/vendor/orders")}>Open</button>
      </div>

      {loading ? <LoadingState message="Loading orders..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load orders" message={error} /> : null}
      {!loading && !error && orders.length === 0 ? <ErrorState title="No orders" message="No orders found yet." /> : null}

      {!loading && !error && orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id || order.id}>
              <div>
                <span>#{String(order._id || order.id).slice(-6).toUpperCase()}</span>
                <strong>{order.userId?.name || order.customer || "Customer"}</strong>
                <small>{getOrderItems(order)}</small>
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
  );
}

export default OrdersSection;
