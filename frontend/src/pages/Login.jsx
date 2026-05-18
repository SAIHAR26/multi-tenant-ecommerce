import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveSession } from "../api/auth";
import AuthPasswordField from "../components/AuthPasswordField";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const session = await login(payload);
      saveSession(session);

      const destinationByRole = {
        admin: "/admin",
        customer: "/customer",
        vendor: "/vendor",
      };

      navigate(destinationByRole[session.user.role] || "/");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page auth-page--split">
      <section className="auth-brand">
        <a className="auth-logo" href="/">
          <span>V</span>
          SHOP
        </a>
        <div className="auth-brand__content">
          <p className="auth-eyebrow">Premium ecommerce access</p>
          <h1>V SHOP</h1>
          <p>One Platform. Infinite Stores.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card__header">
            <p className="auth-eyebrow">Welcome back</p>
            <h2>Login to your account</h2>
            <p>Manage stores, orders, products, and shopping in one place.</p>
          </div>

          <label className="auth-field">
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>

          <AuthPasswordField
            autoComplete="current-password"
            label="Password"
            name="password"
            placeholder="Enter your password"
          />

          <label className="auth-field">
            <span>Role</span>
            <select defaultValue="customer" name="role">
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>

          {status.message ? (
            <p className={`auth-message auth-message--${status.type}`}>{status.message}</p>
          ) : null}

          <button className="auth-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
