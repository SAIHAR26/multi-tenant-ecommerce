import { useState } from "react";
import { forgotPassword } from "../api/auth";
import "./Auth.css";

function ForgotPassword() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });
    setResetToken("");

    try {
      const data = await forgotPassword(Object.fromEntries(formData.entries()));
      setStatus({ type: "success", message: data.message });
      setResetToken(data.resetToken || "");
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
          <p className="auth-eyebrow">Account recovery</p>
          <h1>V SHOP</h1>
          <p>Reset access securely.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card__header">
            <p className="auth-eyebrow">Forgot password</p>
            <h2>Request reset token</h2>
            <p>Enter the email linked to your account.</p>
          </div>

          <label className="auth-field">
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>

          {status.message ? (
            <p className={`auth-message auth-message--${status.type}`}>{status.message}</p>
          ) : null}

          {resetToken ? (
            <label className="auth-field">
              <span>Reset Token</span>
              <input readOnly value={resetToken} />
            </label>
          ) : null}

          <button className="auth-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Sending..." : "Get Reset Token"}
          </button>

          <p className="auth-switch">
            Have a token? <a href="/reset-password">Reset password</a>
          </p>
        </form>
      </section>
    </main>
  );
}

export default ForgotPassword;
