import { useNavigate } from "react-router-dom";

const orders = [
  { id: "#VS-1048", customer: "Anaya Rao", product: "Noir Leather Tote", status: "Paid", amount: "₹20,584" },
  { id: "#VS-1047", customer: "Rohan Mehta", product: "Urban Runner Pro", status: "Packed", amount: "₹15,687" },
  { id: "#VS-1046", customer: "Maya Sen", product: "Utility Jacket", status: "Pending", amount: "₹26,892" },
  { id: "#VS-1045", customer: "Neil Kapoor", product: "Chrome Wallet", status: "Paid", amount: "₹7,138" },
];

function OrdersTable() {
  const navigate = useNavigate();

  return (
    <article className="glass-panel orders-panel">
      <div className="panel-header">
        <div>
          <p className="admin-eyebrow">Recent orders</p>
          <h2>Live order flow</h2>
        </div>
        <button className="text-button" type="button" onClick={() => navigate("/admin/export-orders")}>
          Export
        </button>
      </div>

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
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>
                  <span className={`status-badge status-badge--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default OrdersTable;
