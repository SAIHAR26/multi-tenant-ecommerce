import "./Auth.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, role }
      );

      const data = response.data;

      // 1. Check if the user data property exists on response directly or inside data
      const userObj = data.user || data; 
      const userRole = userObj?.role;

      if (!userRole) {
        alert("Login warning: User role not returned from server.");
        return;
      }

      // Store in localStorage safely
      localStorage.setItem("vshopToken", data.token);
      localStorage.setItem("vshopRole", userRole); // Optional, good to keep prefixed
      localStorage.setItem("vshopUser", JSON.stringify(userObj));

      alert("Login Successful");

      // 2. Perform explicit, clean role-based navigation matching your UI routes
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "vendor") {
        navigate("/vendor");
      } else if (userRole === "customer") {
        navigate("/customer");
      } else {
        console.warn("Unknown user role received:", userRole);
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <main className="auth-page auth-page--split">
      <section className="auth-brand">
        <a className="auth-logo" href="/">
          <span>V</span> SHOP
        </a>
        <div className="auth-brand__content">
          <p className="auth-eyebrow">Premium ecommerce access</p>
          <h1>V SHOP</h1>
          <p>One Platform. Infinite Stores.</p>
        </div>
      </section>
      
      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-card__header">
            <p className="auth-eyebrow">Welcome back</p>
            <h2>Login to your account</h2>
            <p>Manage stores, orders, products, and shopping in one place.</p>
          </div>
          
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          
          <label className="auth-field">
            <span>Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
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
          
          <button className="auth-button" type="submit">
            Login
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