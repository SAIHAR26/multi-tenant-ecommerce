import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getOrders } from "../../services/orderService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;
const getOrderItems = (order) =>
  order.products?.map((item) => item.productId?.name || item.name || "Product").join(", ") || "Order items";

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getOrders()
      .then((data) => {
        const ordersArray = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        if (isMounted) {
          setOrders(ordersArray.slice(0, 6));
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
    <article className="glass-panel orders-panel">
      <div className="panel-header">
        <div>
          <p className="admin-eyebrow">Recent orders</p>
          <h2>Live order flow</h2>
        </div>
        <button className="text-button" type="button">Export</button>
      </div>

      {loading ? <LoadingState message="Loading orders..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load orders" message={error} /> : null}
      {!loading && !error && orders.length === 0 ? <ErrorState title="No orders" message="No orders found." /> : null}

      {!loading && !error && orders.length > 0 ? (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id || order.id}>
                  <td>#{String(order._id || order.id).slice(-6).toUpperCase()}</td>
                  <td>{order.userId?.name || order.customer || "Customer"}</td>
                  <td>{getOrderItems(order)}</td>
                  <td>
                    <span className={`status-badge status-badge--${String(order.status || "pending").toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatPrice(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </article>
  );
}

export default OrdersTable;
