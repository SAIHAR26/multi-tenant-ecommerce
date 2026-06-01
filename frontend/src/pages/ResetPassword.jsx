import { useState } from "react";
import { resetPassword } from "../api/auth";
import AuthPasswordField from "../components/AuthPasswordField";
import "./Auth.css";

function ResetPassword() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const data = await resetPassword(Object.fromEntries(formData.entries()));
      setStatus({ type: "success", message: data.message });
      event.currentTarget.reset();
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
          <p className="auth-eyebrow">Secure reset</p>
          <h1>V SHOP</h1>
          <p>Create a stronger password.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card__header">
            <p className="auth-eyebrow">Reset password</p>
            <h2>Enter reset token</h2>
            <p>Use a password with uppercase, lowercase, number, and special character.</p>
          </div>

          <label className="auth-field">
            <span>Reset Token</span>
            <input name="token" type="text" placeholder="Paste reset token" required />
          </label>

          <AuthPasswordField
            autoComplete="new-password"
            label="New Password"
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

          {status.message ? (
            <p className={`auth-message auth-message--${status.type}`}>{status.message}</p>
          ) : null}

          <button className="auth-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ResetPassword;
