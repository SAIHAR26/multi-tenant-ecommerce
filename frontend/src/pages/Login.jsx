import "./Auth.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [role, setRole] =
    useState("customer");
  const handleLogin = async () => {
    try {
      const response =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email,
            password,
            role,
          }
        );
      // Save token
      localStorage.setItem(
        "token",
        response.data.token
      );
      localStorage.setItem(
        "role",
        response.data.user.role
      );
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );
      alert("Login Successful");
      if (
        response.data.user.role ===
        "admin"
      ) {
        navigate("/admin");
      }
      else if (
        response.data.user.role ===
        "vendor"
      ) {
        navigate("/vendor");
      }
      else {
        navigate("/customer");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
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
          <p className="auth-eyebrow">
            Premium ecommerce access
          </p>
          <h1>V SHOP</h1>
          <p>
            One Platform. Infinite Stores.
          </p>
        </div>
      </section>
      <section className="auth-panel">
        <form className="auth-card">
          <div className="auth-card__header">
            <p className="auth-eyebrow">
              Welcome back
            </p>
            <h2>
              Login to your account
            </h2>
            <p>
              Manage stores, orders,
              products, and shopping
              in one place.
            </p>
          </div>
          {/* EMAIL */}
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </label>
          <label className="auth-field">
            <span>Role</span>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              <option value="customer">
                Customer
              </option>
              <option value="vendor">
                Vendor
              </option>
              <option value="admin">
                Admin
              </option>
            </select>
          </label>
          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" />
              <span>
                Remember me
              </span>
            </label>
            <a href="#forgot">
              Forgot password?
            </a>
          </div>
          {/* LOGIN BUTTON */}
          <button
            className="auth-button"
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
          <p className="auth-switch">
            Don't have an account?
            <a href="/register">
              Sign up
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
export default Login;