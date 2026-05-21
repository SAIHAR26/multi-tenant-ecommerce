import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderTracking } from "../../services/orderService";
import { getSavedUser } from "../../api/auth";

const trackingSteps = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function TrackingPage() {
  const { id } = useParams(); 
  const user = getSavedUser();
  const customerName = user?.name || "Customer";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTracking() {
      try {
        const orderId = id || "current-order";
        const data = await getOrderTracking(orderId);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError("Unable to find order tracking details. " + (err.message || ""));
        setLoading(false);
      }
    }
    fetchTracking();
  }, [id]);

  if (loading) {
    return <div className="customer-page"><p className="customer-eyebrow">Locating your shipment updates...</p></div>;
  }

  /* STEP 7: EMPTY STATE */
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

  const activeStep = trackingSteps.indexOf(order.status) !== -1 ? trackingSteps.indexOf(order.status) : 1;
  const progressPercent = Math.round(((activeStep + 1) / trackingSteps.length) * 100);

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Order tracking</p>
          <h1>Track your premium delivery.</h1>
          <p>Follow every stage from processing to doorstep delivery with clear fulfillment updates.</p>
        </div>
        <button className="customer-primary-button" type="button">Contact Support</button>
      </section>

      <section className="customer-panel">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">ID: {order._id || order.id}</p>
            <h2>{order.product || "Package Shipments"}</h2>
          </div>
          <span className="customer-pill">{order.delivery || "In Transit"}</span>
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
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Delivery address</p><h2>Saved address</h2></div></div>
          <div className="address-card">
            <h3>{customerName}</h3>
            <p>{order.shippingAddress || "Indiranagar, Bengaluru, Karnataka 560038"}</p>
            <span>Express delivery enabled</span>
          </div>
        </article>
        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Shipment notes</p><h2>Courier updates</h2></div></div>
          <div className="offer-stack">
            <div><strong>Status</strong><span>Current status verified as {order.status || "Processing"}.</span></div>
            <div><strong>Packed</strong><span>Quality checked by Luxe Lane partners.</span></div>
            <div><strong>Updates</strong><span>Handed to secure delivery courier network.</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default TrackingPage;