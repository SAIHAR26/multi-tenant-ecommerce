import { useNavigate } from "react-router-dom";
import { getProductImage } from "../../utils/productImages";
import { formatPrice } from "../../utils/orderTotals";

function OrderCard({ order }) {
  const navigate = useNavigate();
  const products = order?.products || [];
  const firstProduct = products[0]?.productId || {};
  const productNames = products
    .map((item) => `${item.productId?.name || "Product"} x${item.quantity || 1}`)
    .filter(Boolean)
    .join(", ");
  const vendors = [
    ...new Set(
      products
        .map((item) => item.productId?.storeId?.storeName || item.productId?.vendor?.name)
        .filter(Boolean)
    ),
  ].join(", ");
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN")
    : "Date pending";
  const eta = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN")
    : "ETA pending";

  return (
    <article className="customer-order-card">
      <img src={getProductImage(firstProduct)} alt={firstProduct.name || "Order"} />

      <div>
        <p className="customer-eyebrow">{order.status}</p>
        <h3>{productNames || `Order ${order._id?.slice(-6) || ""}`}</h3>
        <span>{vendors || "V SHOP"} - {products.length} product groups - {formatPrice(order.totalAmount)}</span>
        <small>Estimated delivery: {eta}</small>
      </div>

      <div className="customer-order-card__side">
        <strong>{orderDate}</strong>
        <button
          className="customer-secondary-button"
          type="button"
          onClick={() => navigate(`/customer/tracking/${order._id || order.id}`)}
        >
          Track Order
        </button>
      </div>
    </article>
  );
}

export default OrderCard;
