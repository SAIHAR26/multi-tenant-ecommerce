import { useState } from "react";

function AuthPasswordField({ label, name, placeholder, autoComplete, required = true, minLength }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-password-control">
        <input
          autoComplete={autoComplete}
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          required={required}
          type={isVisible ? "text" : "password"}
        />
        <button
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className={`auth-password-toggle ${isVisible ? "auth-password-toggle--visible" : ""}`}
          onClick={() => setIsVisible((value) => !value)}
          type="button"
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </label>
  );
}

export default AuthPasswordField;
