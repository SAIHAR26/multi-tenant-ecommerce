import { orders, trackingSteps } from "./customerData";

const activeStep = 3;

function TrackingPage() {
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
            <p className="customer-eyebrow">{orders[0].id}</p>
            <h2>{orders[0].product}</h2>
          </div>
          <span className="customer-pill">{orders[0].delivery}</span>
        </div>

        {/* Tracking timeline with glowing status indicators. */}
        <div className="tracking-timeline">
          {trackingSteps.map((step, index) => (
            <div className={`tracking-step${index <= activeStep ? " tracking-step--active" : ""}`} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
        <div className="tracking-progress"><span style={{ width: "78%" }} /></div>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Delivery address</p><h2>Saved address</h2></div></div>
          <div className="address-card">
            <h3>Anaya Rao</h3>
            <p>Indiranagar, Bengaluru, Karnataka 560038</p>
            <span>Express delivery enabled</span>
          </div>
        </article>
        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Shipment notes</p><h2>Courier updates</h2></div></div>
          <div className="offer-stack">
            <div><strong>Packed</strong><span>Quality checked by Luxe Lane.</span></div>
            <div><strong>Shipped</strong><span>Handed to express courier.</span></div>
            <div><strong>Out today</strong><span>Delivery partner assigned.</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default TrackingPage;
