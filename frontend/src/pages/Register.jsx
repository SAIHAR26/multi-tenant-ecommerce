import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardPath, register, saveSession } from "../api/auth";
import AuthPasswordField from "../components/AuthPasswordField";
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

const filesToDataUrls = async (files) =>
  Promise.all(
    Array.from(files || []).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, data: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCustomer = role === "customer";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      role,
    };

    if (role === "vendor") {
      const documentFiles = await filesToDataUrls(event.currentTarget.businessDocuments?.files);
      payload.businessDocuments = documentFiles.map((file) => `${file.name}:${file.data}`);
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const session = await register(payload);
      saveSession(session);
      navigate(getDashboardPath(session.user.role));
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <form className="auth-card signup-form" onSubmit={handleSubmit}>
          <div className="auth-card__header">
            <p className="auth-eyebrow">
              {isCustomer ? "Customer signup" : "Vendor signup"}
            </p>
            <h2>{isCustomer ? "Create customer profile" : "Create vendor store"}</h2>
          </div>

          {isCustomer ? <CustomerFields /> : <VendorFields />}

          {status.message ? (
            <p className={`auth-message auth-message--${status.type}`}>{status.message}</p>
          ) : null}

          <button className="auth-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating account..." : "Create Account"}
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
        <input name="name" type="text" placeholder="Enter your full name" required />
      </label>

      <label className="auth-field">
        <span>Email</span>
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>

      <label className="auth-field">
        <span>Phone Number</span>
        <input name="phone" type="tel" placeholder="+91 98765 43210" />
      </label>

      <label className="auth-field">
        <span>Location</span>
        <input name="location" type="text" placeholder="City, State" />
      </label>

      <label className="auth-field">
        <span>Age</span>
        <input name="age" type="number" placeholder="21" />
      </label>

      <AuthPasswordField
        autoComplete="new-password"
        label="Password"
        minLength="8"
        name="password"
        placeholder="Create password"
      />

      <AuthPasswordField
        autoComplete="new-password"
        label="Confirm Password"
        minLength="8"
        name="confirmPassword"
        placeholder="Confirm password"
      />
    </div>
  );
}

function VendorFields() {
  return (
    <div className="auth-grid">
      <label className="auth-field">
        <span>Store Name</span>
        <input name="storeName" type="text" placeholder="Your store name" required />
      </label>

      <label className="auth-field">
        <span>Owner Name</span>
        <input name="name" type="text" placeholder="Store owner name" required />
      </label>

      <label className="auth-field">
        <span>Email</span>
        <input name="email" type="email" placeholder="vendor@example.com" required />
      </label>

      <label className="auth-field">
        <span>Phone Number</span>
        <input name="phone" type="tel" placeholder="+91 98765 43210" />
      </label>

      <label className="auth-field">
        <span>Store Category</span>
        <select defaultValue="" name="storeCategory" required>
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
        <input name="location" type="text" placeholder="City, State" required />
      </label>

      <label className="auth-field auth-field--wide">
        <span>Store Description</span>
        <input name="storeDescription" type="text" placeholder="Describe your store" required />
      </label>

      <label className="auth-field">
        <span>GST Number</span>
        <input name="gstNumber" type="text" placeholder="GSTIN" />
      </label>

      <label className="auth-field">
        <span>Business Registration Number</span>
        <input name="businessRegistrationNumber" type="text" placeholder="Registration number" required />
      </label>

      <label className="auth-field">
        <span>Business Type</span>
        <input name="businessType" type="text" placeholder="Proprietorship, LLP, Pvt Ltd" required />
      </label>

      <label className="auth-field auth-field--wide">
        <span>Business Address</span>
        <input name="businessAddress" type="text" placeholder="Registered business address" required />
      </label>

      <label className="auth-field">
        <span>PAN Number</span>
        <input name="panNumber" type="text" placeholder="PAN number" />
      </label>

      <label className="auth-field auth-field--wide">
        <span>Business Documents</span>
        <input accept=".pdf,image/*" multiple name="businessDocuments" type="file" required />
      </label>

      <label className="auth-field auth-field--wide">
        <span>Bank Details</span>
        <input name="bankDetails" type="text" placeholder="Account holder, account number, IFSC" />
      </label>

      <AuthPasswordField
        autoComplete="new-password"
        label="Password"
        minLength="8"
        name="password"
        placeholder="Create password"
      />

      <AuthPasswordField
        autoComplete="new-password"
        label="Confirm Password"
        minLength="8"
        name="confirmPassword"
        placeholder="Confirm password"
      />
    </div>
  );
}

export default Register;
