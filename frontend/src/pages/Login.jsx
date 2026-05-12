import "./Auth.css";

function Login() {
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
        <form className="auth-card">
          <div className="auth-card__header">
            <p className="auth-eyebrow">Welcome back</p>
            <h2>Login to your account</h2>
            <p>Manage stores, orders, products, and shopping in one place.</p>
          </div>

          <label className="auth-field">
            <span>Email</span>
            <input type="email" placeholder="you@example.com" />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input type="password" placeholder="Enter your password" />
          </label>

          <label className="auth-field">
            <span>Role</span>
            <select defaultValue="customer">
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

          <button className="auth-button" type="button">
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
