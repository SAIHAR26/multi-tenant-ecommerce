import { useState } from "react";
import "./Auth.css";

const categories = [
  "Fashion",
  "Shoes",
  "Electronics",
  "Books",
  "Men Wear",
  "Women Wear",
  "Kids",
  "Accessories",
  "Other",
];

function Register() {
  const [role, setRole] = useState("customer");
  const isCustomer = role === "customer";

  return (
    <main className="auth-page auth-page--register">
      <a className="auth-logo auth-logo--floating" href="/">
        <span>V</span>
        SHOP
      </a>

      <section className="signup-shell">
        <div className="signup-header">
          <p className="auth-eyebrow">Join the marketplace</p>
          <h1>Create your V SHOP account</h1>
          <p>
            Choose your role and start with a premium ecommerce experience built
            for customers and vendors.
          </p>
        </div>

        <div className="role-grid" aria-label="Choose signup role">
          <button
            className={`role-card ${isCustomer ? "role-card--active" : ""}`}
            type="button"
            onClick={() => setRole("customer")}
          >
            <span>Customer</span>
            <strong>Shop premium collections across trusted stores.</strong>
          </button>

          <button
            className={`role-card ${!isCustomer ? "role-card--active" : ""}`}
            type="button"
            onClick={() => setRole("vendor")}
          >
            <span>Vendor</span>
            <strong>Launch your store and manage products with style.</strong>
          </button>
        </div>

        <form className="auth-card signup-form">
          <div className="auth-card__header">
            <p className="auth-eyebrow">
              {isCustomer ? "Customer signup" : "Vendor signup"}
            </p>
            <h2>{isCustomer ? "Create customer profile" : "Create vendor store"}</h2>
          </div>

          {isCustomer ? <CustomerFields /> : <VendorFields />}

          <button className="auth-button" type="button">
            Create Account
          </button>

          <p className="auth-switch">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </section>
    </main>
  );
}

function CustomerFields() {
  return (
    <div className="auth-grid">
      <label className="auth-field auth-field--wide">
        <span>Full Name</span>
        <input type="text" placeholder="Enter your full name" />
      </label>

      <label className="auth-field">
        <span>Email</span>
        <input type="email" placeholder="you@example.com" />
      </label>

      <label className="auth-field">
        <span>Phone Number</span>
        <input type="tel" placeholder="+91 98765 43210" />
      </label>

      <label className="auth-field">
        <span>Location</span>
        <input type="text" placeholder="City, State" />
      </label>

      <label className="auth-field">
        <span>Age</span>
        <input type="number" placeholder="21" />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <input type="password" placeholder="Create password" />
      </label>

      <label className="auth-field">
        <span>Confirm Password</span>
        <input type="password" placeholder="Confirm password" />
      </label>
    </div>
  );
}

function VendorFields() {
  return (
    <div className="auth-grid">
      <label className="auth-field">
        <span>Store Name</span>
        <input type="text" placeholder="Your store name" />
      </label>

      <label className="auth-field">
        <span>Owner Name</span>
        <input type="text" placeholder="Store owner name" />
      </label>

      <label className="auth-field">
        <span>Email</span>
        <input type="email" placeholder="vendor@example.com" />
      </label>

      <label className="auth-field">
        <span>Phone Number</span>
        <input type="tel" placeholder="+91 98765 43210" />
      </label>

      <label className="auth-field">
        <span>Store Category</span>
        <select defaultValue="">
          <option value="" disabled>
            Select category
          </option>
          {categories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="auth-field">
        <span>Shop Location</span>
        <input type="text" placeholder="City, State" />
      </label>

      <label className="auth-field auth-field--wide">
        <span>Bank Details</span>
        <input type="text" placeholder="Account holder, account number, IFSC" />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <input type="password" placeholder="Create password" />
      </label>

      <label className="auth-field">
        <span>Confirm Password</span>
        <input type="password" placeholder="Confirm password" />
      </label>
    </div>
  );
}

export default Register;
