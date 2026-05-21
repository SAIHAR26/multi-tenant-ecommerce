import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser } from "../../api/auth";
import { products } from "./customerData";
import "./CheckoutPage.css";

const paymentMethods = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Cash On Delivery",
];

const createInitialAddress = () => ({
  fullName: getSavedUser()?.name || "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
});

function CheckoutPage() {
  const navigate = useNavigate();

  const [address, setAddress] = useState(createInitialAddress());
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [coupon, setCoupon] = useState("");
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [orderItems] = useState(() =>
    products.slice(0, 2).map((product, index) => ({
      ...product,
      quantity: index + 1,
    }))
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => window.clearTimeout(timerId);
  }, []);

  const totals = useMemo(() => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = Math.round(subtotal * 0.12);
    const deliveryCharge = subtotal > 0 ? 99 : 0;
    const total = subtotal - discount + deliveryCharge;

    return {
      subtotal,
      discount,
      deliveryCharge,
      total,
    };
  }, [orderItems]);

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddress((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));

    setIsAddressSaved(false);
  };

  const handleSaveAddress = (event) => {
    event.preventDefault();
    setIsAddressSaved(true);
  };

  const handlePlaceOrder = () => {
    navigate("/customer/order-success");
  };

  if (isLoading) {
    return (
      <div className="checkout-state customer-panel">
        <div className="checkout-loader" />

        <h2>Loading order...</h2>

        <p>Please wait while we prepare your secure checkout.</p>
      </div>
    );
  }

  if (!orderItems.length) {
    return (
      <div className="checkout-state customer-panel">
        <span className="checkout-empty-icon">0</span>

        <h2>No items available</h2>

        <p>Add products to your cart before starting checkout.</p>
      </div>
    );
  }

  return (
    <div className="customer-page checkout-page">
      <section className="customer-hero customer-hero--compact checkout-hero">
        <div>
          <p className="customer-eyebrow">Secure checkout</p>

          <h1>Complete your V SHOP order.</h1>

          <p>
            Confirm delivery details, choose payment, and place your premium
            order.
          </p>
        </div>

        <span className="checkout-secure-pill">
          Protected payment
        </span>
      </section>

      <section className="checkout-layout">
        <div className="checkout-main">
          <form
            className="customer-panel checkout-card"
            onSubmit={handleSaveAddress}
          >
            <div className="customer-panel__header">
              <div>
                <p className="customer-eyebrow">
                  Shipping address
                </p>

                <h2>Delivery details</h2>
              </div>

              {isAddressSaved ? (
                <span className="customer-pill">Saved</span>
              ) : null}
            </div>

            <div className="checkout-form-grid">
              <CheckoutField
                label="Full Name"
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                required
              />

              <CheckoutField
                label="Phone Number"
                name="phone"
                type="tel"
                value={address.phone}
                onChange={handleAddressChange}
                required
              />

              <CheckoutField
                label="Address"
                name="address"
                value={address.address}
                onChange={handleAddressChange}
                required
                wide
              />

              <CheckoutField
                label="City"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                required
              />

              <CheckoutField
                label="State"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                required
              />

              <CheckoutField
                label="Pincode"
                name="pincode"
                inputMode="numeric"
                value={address.pincode}
                onChange={handleAddressChange}
                required
              />

              <CheckoutField
                label="Country"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                required
              />
            </div>

            <button
              className="customer-secondary-button checkout-save-button"
              type="submit"
            >
              Save Address
            </button>
          </form>

          <section className="customer-panel checkout-card">
            <div className="customer-panel__header">
              <div>
                <p className="customer-eyebrow">
                  Payment method
                </p>

                <h2>Choose payment option</h2>
              </div>
            </div>

            <div className="payment-method-grid">
              {paymentMethods.map((method) => (
                <label
                  className={`payment-method ${
                    paymentMethod === method
                      ? "payment-method--active"
                      : ""
                  }`}
                  key={method}
                >
                  <input
                    checked={paymentMethod === method}
                    name="paymentMethod"
                    type="radio"
                    value={method}
                    onChange={() => setPaymentMethod(method)}
                  />

                  <span />

                  <strong>{method}</strong>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="customer-panel checkout-summary">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">Order summary</p>

              <h2>{orderItems.length} items</h2>
            </div>
          </div>

          <div className="checkout-items">
            {orderItems.map((item) => (
              <article
                className="checkout-item"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>

                  <p>{item.vendor}</p>

                  <span>Qty: {item.quantity}</span>
                </div>

                <strong>
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </article>
            ))}
          </div>

          <div className="coupon-box">
            <label htmlFor="checkout-coupon">
              Coupon
            </label>

            <div>
              <input
                id="checkout-coupon"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(event) =>
                  setCoupon(event.target.value)
                }
              />

              <button type="button">
                Apply
              </button>
            </div>
          </div>

          <div className="checkout-total-stack">
            <SummaryRow
              label="Price"
              value={formatPrice(totals.subtotal)}
            />

            <SummaryRow
              label="Discount"
              value={`-${formatPrice(totals.discount)}`}
            />

            <SummaryRow
              label="Delivery charge"
              value={formatPrice(totals.deliveryCharge)}
            />

            <div className="checkout-grand-total">
              <span>Total price</span>

              <strong>
                {formatPrice(totals.total)}
              </strong>
            </div>
          </div>

          <button
            className="checkout-place-order"
            type="button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </aside>
      </section>
    </div>
  );
}

function CheckoutField({
  label,
  name,
  type = "text",
  wide = false,
  ...props
}) {
  return (
    <label
      className={
        wide
          ? "checkout-field checkout-field--wide"
          : "checkout-field"
      }
    >
      <span>{label}</span>

      <input
        name={name}
        type={type}
        placeholder={label}
        {...props}
      />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="checkout-summary-row">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

function formatPrice(value) {
  return `Rs ${value.toLocaleString("en-IN")}`;
}

export default CheckoutPage;