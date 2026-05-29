import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSavedUser } from "../../api/auth";
import { cancelOrder, getOrderTracking } from "../../services/orderService";
import { formatPrice } from "../../utils/orderTotals";
import { getProductImage } from "../../utils/productImages";

const trackingSteps = ["Ordered", "Packed", "Shipped", "Delivered"];
const statusStepMap = {
  PROCESSING: 0,
  PACKED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: 0,
};

function TrackingPage() {
  const { id } = useParams();
  const user = getSavedUser();
  const customerName = user?.name || "Customer";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTracking() {
      try {
        const orderId = id || "current-order";
        const data = await getOrderTracking(orderId);
        setOrder(data);
        setError("");
      } catch (err) {
        setError("Unable to find order tracking details. " + (err.message || ""));
      } finally {
        setLoading(false);
      }
    }

    fetchTracking();
  }, [id]);

  if (loading) {
    return (
      <div className="customer-page">
        <p className="customer-eyebrow">Locating your shipment updates...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div>
            <p className="customer-eyebrow" style={{ color: "orange" }}>Tracking Lookup Missing</p>
            <h1>No active package tracking found.</h1>
            <p>We couldn't retrieve tracking information for this identifier. Review your active delivery histories.</p>
          </div>
          <Link className="customer-primary-button" to="/customer/orders">View My Orders</Link>
        </section>
      </div>
    );
  }

  const products = order.products || [];
  const firstProduct = products[0]?.productId || {};
  const productNames = products
    .map((item) => `${item.productId?.name || "Product"} x${item.quantity || 1}`)
    .filter(Boolean)
    .join(", ");
  const activeStep = statusStepMap[order.status] ?? 0;
  const progressPercent = Math.round(((activeStep + 1) / trackingSteps.length) * 100);
  const canCancel = !["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status);
  const eta = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN")
    : "ETA pending";

  const handleCancelOrder = async () => {
    const shouldCancel = window.confirm("Cancel this order?");
    if (!shouldCancel) return;

    try {
      setCancelling(true);
      setOrder(await cancelOrder(order._id || order.id));
    } catch (err) {
      setError(err.message || "Order could not be cancelled.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Order tracking</p>
          <h1>Track your premium delivery.</h1>
          <p>Follow every stage from processing to doorstep delivery with clear fulfillment updates.</p>
        </div>
        <div className="support-actions">
          {canCancel ? (
            <button className="customer-secondary-button" type="button" disabled={cancelling} onClick={handleCancelOrder}>
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          ) : null}
          <a className="customer-primary-button" href="tel:+919000000000">Call Support</a>
          <a className="customer-secondary-button" href="mailto:support@vshop.com">Email Support</a>
        </div>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">ID: {order._id || order.id}</p>
            <h2>{productNames || "Package shipment"}</h2>
          </div>
          <span className="customer-pill">{order.status || "PROCESSING"}</span>
        </div>

        <div className="tracking-order-preview">
          <img src={getProductImage(firstProduct)} alt={firstProduct.name || "Order"} />
          <div>
            <strong>{formatPrice(order.totalAmount)}</strong>
            <span>{products.length} item groups - Payment {order.paymentStatus}</span>
            <span>Estimated delivery: {eta}</span>
          </div>
        </div>

        <div className="tracking-timeline">
          {trackingSteps.map((step, index) => (
            <div className={`tracking-step${index <= activeStep ? " tracking-step--active" : ""}`} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
        <div className="tracking-progress">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div><p className="customer-eyebrow">Delivery address</p><h2>Saved address</h2></div>
          </div>
          <div className="address-card">
            <h3>{customerName}</h3>
            <p>{order.deliveryAddress || "Address not available"}</p>
            <span>{order.deliveryDistanceKm || 0} km route - {order.deliveryEstimateDays || 3} day estimate</span>
          </div>
        </article>
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div><p className="customer-eyebrow">Shipment notes</p><h2>Courier updates</h2></div>
          </div>
          <div className="offer-stack">
            <div><strong>Status</strong><span>Current status verified as {order.status || "PROCESSING"}.</span></div>
            <div><strong>Products</strong><span>{productNames || "Order products"}</span></div>
            <div><strong>Delivery ETA</strong><span>{eta}</span></div>
            <div><strong>Updates</strong><span>Latest fulfillment status is synced from vendor updates in MongoDB.</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default TrackingPage;
