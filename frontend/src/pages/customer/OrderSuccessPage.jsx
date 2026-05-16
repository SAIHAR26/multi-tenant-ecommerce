import { Link } from "react-router-dom";
import "./CheckoutPage.css";

function OrderSuccessPage() {
  return (
    <div className="customer-page">
      <section className="checkout-state customer-panel order-success-state">
        <span className="checkout-empty-icon">OK</span>
        <p className="customer-eyebrow">Order placed</p>
        <h2>Your V SHOP order is confirmed.</h2>
        <p>We are preparing your products and will keep tracking updates ready in your customer dashboard.</p>
        <div className="order-success-actions">
          <Link className="customer-primary-button" to="/customer/orders">
            View Orders
          </Link>
          <Link className="customer-secondary-button" to="/customer">
            Continue Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}

export default OrderSuccessPage;
